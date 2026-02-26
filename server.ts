import express from 'express';
import { createServer as createViteServer } from 'vite';
import cors from 'cors';
import { Telegraf, session, Scenes, Markup } from 'telegraf';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- Database ---
const DB_FILE = path.resolve('catalog.json');

interface CatalogItem {
  id: number;
  name: string;
  gender: string;
  category: string;
  color: string;
  size: string;
  image: string;
  isVisible: boolean;
  isAvailable: boolean;
}

let catalog: CatalogItem[] = [];

if (fs.existsSync(DB_FILE)) {
  try {
    catalog = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (e) {
    console.error('Error reading DB', e);
  }
}

const saveDB = () => {
  fs.writeFileSync(DB_FILE, JSON.stringify(catalog, null, 2));
};

const getNextId = () => {
  return catalog.length > 0 ? Math.max(...catalog.map(i => i.id)) + 1 : 1;
};

// --- API Routes ---
app.get('/api/catalog', (req, res) => {
  res.json(catalog);
});

// --- Telegram Bot ---
const botToken = process.env.TELEGRAM_BOT_TOKEN;
if (botToken) {
  const bot = new Telegraf<any>(botToken);

  // Add Item Wizard
  const addWizard = new Scenes.WizardScene<any>(
    'add-item',
    async (ctx) => {
      await ctx.reply('Masculino ou Feminino?', Markup.keyboard([['Masculino', 'Feminino']]).oneTime().resize());
      return ctx.wizard.next();
    },
    async (ctx) => {
      if (ctx.message && 'text' in ctx.message && ctx.message.text) {
        (ctx.wizard.state as any).gender = ctx.message.text;
        await ctx.reply('Mande a foto.', Markup.removeKeyboard());
        return ctx.wizard.next();
      }
      return;
    },
    async (ctx) => {
      if (ctx.message && 'photo' in ctx.message && ctx.message.photo) {
        const photo = ctx.message.photo[ctx.message.photo.length - 1];
        const fileLink = await ctx.telegram.getFileLink(photo.file_id);
        (ctx.wizard.state as any).image = fileLink.href;
        await ctx.reply('Qual categoria (Ex: Vestido de Festa, Noiva, Noivo..)?');
        return ctx.wizard.next();
      }
      return;
    },
    async (ctx) => {
      if (ctx.message && 'text' in ctx.message && ctx.message.text) {
        (ctx.wizard.state as any).category = ctx.message.text;
        await ctx.reply('Qual modelo (Ex: Vestido Logo, Terno Tradicional)? (Este entraria no nome da peça)');
        return ctx.wizard.next();
      }
      return;
    },
    async (ctx) => {
      if (ctx.message && 'text' in ctx.message && ctx.message.text) {
        (ctx.wizard.state as any).name = ctx.message.text;
        await ctx.reply('Qual a Cor?');
        return ctx.wizard.next();
      }
      return;
    },
    async (ctx) => {
      if (ctx.message && 'text' in ctx.message && ctx.message.text) {
        (ctx.wizard.state as any).color = ctx.message.text;
        await ctx.reply('Qual o tamanho?');
        return ctx.wizard.next();
      }
      return;
    },
    async (ctx) => {
      if (ctx.message && 'text' in ctx.message && ctx.message.text) {
        (ctx.wizard.state as any).size = ctx.message.text;
        
        const state = ctx.wizard.state as any;
        const newItem: CatalogItem = {
          id: getNextId(),
          gender: state.gender,
          image: state.image,
          category: state.category,
          name: state.name,
          color: state.color,
          size: state.size,
          isVisible: true,
          isAvailable: true,
        };
        
        catalog.push(newItem);
        saveDB();
        
        await ctx.reply(`Item adicionado com sucesso!\nCOD: ${newItem.id}\nModelo: ${newItem.name}\nCategoria: ${newItem.category}`);
        return ctx.scene.leave();
      }
      return;
    }
  );

  // Delete Item Wizard
  const deleteWizard = new Scenes.WizardScene<any>(
    'delete-item',
    async (ctx) => {
      await ctx.reply('Qual COD do vestido que quer Deletar?');
      return ctx.wizard.next();
    },
    async (ctx) => {
      if (ctx.message && 'text' in ctx.message && ctx.message.text) {
        const id = parseInt(ctx.message.text);
        const item = catalog.find(i => i.id === id);
        if (!item) {
          await ctx.reply('COD não encontrado. Cancelando operação.');
          return ctx.scene.leave();
        }
        (ctx.wizard.state as any).deleteId = id;
        await ctx.reply(`Escreva "confirmo" para deletar esse cadastro (COD: ${id} - ${item.name}).`);
        return ctx.wizard.next();
      }
      return;
    },
    async (ctx) => {
      if (ctx.message && 'text' in ctx.message && ctx.message.text.toLowerCase() === 'confirmo') {
        const state = ctx.wizard.state as any;
        catalog = catalog.filter(i => i.id !== state.deleteId);
        saveDB();
        await ctx.reply('Cadastro deletado com sucesso.');
      } else {
        await ctx.reply('Operação cancelada.');
      }
      return ctx.scene.leave();
    }
  );

  // Edit Item Wizard
  const editWizard = new Scenes.WizardScene(
    'edit-item',
    async (ctx) => {
      await ctx.reply('Qual COD do vestido que quer Editar?');
      return ctx.wizard.next();
    },
    async (ctx) => {
      if (ctx.message && 'text' in ctx.message && ctx.message.text) {
        const id = parseInt(ctx.message.text);
        const item = catalog.find(i => i.id === id);
        if (!item) {
          await ctx.reply('COD não encontrado. Cancelando operação.');
          return ctx.scene.leave();
        }
        (ctx.wizard.state as any).editId = id;
        await ctx.reply('O que quer editar Imagem, Categoria, Modelo, Cor ou tamanho? (Pode escolher mais de 1 opção separando por vírgula)');
        return ctx.wizard.next();
      }
      return;
    },
    async (ctx) => {
      if (ctx.message && 'text' in ctx.message && ctx.message.text) {
        const fields = ctx.message.text.toLowerCase().split(',').map(s => s.trim());
        const validFields = ['imagem', 'categoria', 'modelo', 'cor', 'tamanho'];
        const fieldsToEdit = fields.filter(f => validFields.includes(f));
        
        if (fieldsToEdit.length === 0) {
          await ctx.reply('Nenhum campo válido selecionado. Cancelando operação.');
          return ctx.scene.leave();
        }
        
        (ctx.wizard.state as any).fieldsToEdit = fieldsToEdit;
        (ctx.wizard.state as any).currentFieldIndex = 0;
        
        const firstField = fieldsToEdit[0];
        if (firstField === 'imagem') {
          await ctx.reply('Mande a nova foto.');
        } else {
          await ctx.reply(`Qual o novo valor para ${firstField}?`);
        }
        return ctx.wizard.next();
      }
      return;
    },
    async (ctx) => {
      const state = ctx.wizard.state as any;
      const fieldsToEdit = state.fieldsToEdit;
      const currentIndex = state.currentFieldIndex;
      const currentField = fieldsToEdit[currentIndex];
      
      let newValue: any = null;
      
      if (currentField === 'imagem' && ctx.message && 'photo' in ctx.message && ctx.message.photo) {
        const photo = ctx.message.photo[ctx.message.photo.length - 1];
        const fileLink = await ctx.telegram.getFileLink(photo.file_id);
        newValue = fileLink.href;
      } else if (ctx.message && 'text' in ctx.message && ctx.message.text) {
        newValue = ctx.message.text;
      }
      
      if (newValue) {
        const id = state.editId;
        const itemIndex = catalog.findIndex(i => i.id === id);
        if (itemIndex !== -1) {
          if (currentField === 'imagem') catalog[itemIndex].image = newValue;
          if (currentField === 'categoria') catalog[itemIndex].category = newValue;
          if (currentField === 'modelo') catalog[itemIndex].name = newValue;
          if (currentField === 'cor') catalog[itemIndex].color = newValue;
          if (currentField === 'tamanho') catalog[itemIndex].size = newValue;
          saveDB();
        }
        
        state.currentFieldIndex++;
        if (state.currentFieldIndex < fieldsToEdit.length) {
          const nextField = fieldsToEdit[state.currentFieldIndex];
          if (nextField === 'imagem') {
            await ctx.reply('Mande a nova foto.');
          } else {
            await ctx.reply(`Qual o novo valor para ${nextField}?`);
          }
          return; // Stay in this step
        } else {
          await ctx.reply('Edição concluída com sucesso!');
          return ctx.scene.leave();
        }
      }
      return;
    }
  );

  const stage = new Scenes.Stage<Scenes.WizardContext>([addWizard, deleteWizard, editWizard]);
  bot.use(session());
  bot.use(stage.middleware());

  bot.command('adicionar', (ctx) => ctx.scene.enter('add-item'));
  bot.command('delete', (ctx) => ctx.scene.enter('delete-item'));
  bot.command('editar', (ctx) => ctx.scene.enter('edit-item'));

  bot.launch().then(() => console.log('Telegram Bot is running!'));

  // Enable graceful stop
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
} else {
  console.warn('TELEGRAM_BOT_TOKEN is not set. Bot is disabled.');
}

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
