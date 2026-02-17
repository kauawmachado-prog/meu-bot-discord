require("dotenv").config();
const { REST, Routes } = require("discord.js");

// ✅ Coloca aqui o ID do seu BOT (Application ID)
const CLIENT_ID = process.env.CLIENT_ID;

// ✅ Coloca aqui o ID do seu servidor (Guild ID)
const GUILD_ID = process.env.GUILD_ID;

// ✅ Seus slash commands
const commands = [
  {
    name: "configurar",
    description: "Abre o hub de configurações",
  },
  {
    name: "criar_ticket",
    description: "Cria um ticket",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("🚀 Registrando slash commands...");
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });
    console.log("✅ Slash commands registrados no servidor!");
  } catch (err) {
    console.error("❌ Erro ao registrar:", err);
  }
})();
