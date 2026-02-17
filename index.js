const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();  

console.log("TOKEN carregado:", process.env.TOKEN ? "SIM ✅" : "NÃO ❌");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ]
});
client.once('clientReady', async () => {
  console.log(`🔥 Bot online como ${client.user.tag}`);

  client.user.setPresence({
    activities: [{ name: 'VIDA MANSA RP' }],
    status: 'online'
  });
});  
  // 👇 ADICIONA ISSO AQUI
   const { REST, Routes, SlashCommandBuilder } = require('discord.js');

   const commands = [
      new SlashCommandBuilder()
         .setName('configurar')
         .setDescription('Abre o hub de configurações'),

      new SlashCommandBuilder()
         .setName('criar_ticket')
         .setDescription('Cria um ticket'),
   ].map(cmd => cmd.toJSON());

   const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

   try {
      await rest.put(
         Routes.applicationGuildCommands('1473135725900988589', '1471240969830797432'),
         { body: commands }
      );
      console.log('✅ Comandos registrados!');
   } catch (err) {
      console.error(err);
   }
// Configurações
const CATEGORIES = {

    suporte: {
        label: 'Suporte',
        description: 'Ajuda geral sobre o servidor e dúvidas frequentes.',
        emoji: '📁',
        color: 0x3498DB
    },
    denuncias: {
        label: 'Denúncias',
        description: 'Reporte comportamentos indevidos ou jogadores suspeitos.',
        emoji: '🚨',
        color: 0xE74C3C
    },
    bugs: {
        label: 'Bugs',
        description: 'Informe erros ou falhas encontradas no servidor.',
        emoji: '🐛',
        color: 0xF39C12
    },
    compras: {
        label: 'Compras',
        description: 'Suporte sobre compras ou problemas com benefícios.',
        emoji: '💳',
        color: 0x2ECC71
    }
};

// Função para gerar ID do ticket
function generateTicketId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Função para criar embed de boas-vindas
function createWelcomeEmbed() {
    const embed = new EmbedBuilder()
        .setTitle('VIDA MANSA | TICKET')
        .setDescription('Seja bem-vindo(a) ao sistema de atendimento do VIDAMANSA. Para obter **SUPORTE** abra um ticket clicando no botão a baixo..')
        .setColor(0xE74C3C)
        .setImage('https://cdn.discordapp.com/attachments/1464384903431979147/1473140860274217228/content.png?ex=699520d6&is=6993cf56&hm=8985bea83427a99c697ea6af987550577ccba591450e616e78fc4205d7a1cf4f&.png'); // Substitua pela URL da imagem do banner
    
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('select_category')
        .setPlaceholder('Selecione a categoria:')
        .addOptions(
            Object.entries(CATEGORIES).map(([key, category]) => 
                new StringSelectMenuOptionBuilder()
                    .setLabel(category.label)
                    .setDescription(category.description)
                    .setValue(key)
                    .setEmoji(category.emoji)
            )
        );

    const row = new ActionRowBuilder().addComponents(selectMenu);

    return { embeds: [embed], components: [row] };
}

// Função para criar modal de motivo
function createReasonModal(category) {
    const modal = new ModalBuilder()
        .setCustomId(`ticket_reason_modal_${category}`)
        .setTitle('Descreva o motivo do contato:');

    const reasonInput = new TextInputBuilder()
        .setCustomId('ticket_reason')
        .setLabel('Motivo do contato: *')
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('✍️ Escreva aqui')
        .setRequired(true)
        .setMaxLength(1000);

    const row = new ActionRowBuilder().addComponents(reasonInput);
    modal.addComponents(row);

    return modal;
}

// Função para criar embed do ticket
function createTicketEmbed(user, ticketId, reason, category) {
    const categoryInfo = CATEGORIES[category];
    
    const embed = new EmbedBuilder()
        .setTitle('VIDA MANSA | TICKET')
        .setDescription('Aguarde que algum membro da STAFF venha verificar seu TICKET')
        .addFields(
            { name: 'ID do Ticket:', value: `\`${ticketId}\``, inline: false },
            { name: 'Motivo do contato:', value: `\`${reason}\``, inline: false },
            { name: 'Tipo de ticket:', value: `${categoryInfo.emoji} \`${categoryInfo.label}\``, inline: false }
        )
        .setColor(categoryInfo.color || 0x3498DB)
        .setTimestamp();

    return embed;
}

// Função para criar botões do ticket
function createTicketButtons() {
    const row1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('ticket_leave')
                .setLabel('Sair do ticket')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('🚪'),
            new ButtonBuilder()
                .setCustomId('ticket_claim')
                .setLabel('Assumir Ticket')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('📋'),
            new ButtonBuilder()
                .setCustomId('ticket_rename')
                .setLabel('Renomear Sala')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('📝'),
            new ButtonBuilder()
                .setCustomId('ticket_notify')
                .setLabel('Notificar Membro')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🔔')
        );

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('ticket_add')
                .setLabel('Adicionar Membro')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('➕'),
            new ButtonBuilder()
                .setCustomId('ticket_remove')
                .setLabel('Remover Membro')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('➖'),
            new ButtonBuilder()
                .setCustomId('ticket_call')
                .setLabel('Criar Call')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('📞'),
            new ButtonBuilder()
                .setCustomId('ticket_close')
                .setLabel('Fechar Ticket')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('🔒')
        );

    return [row1, row2];
}

client.once('ready', () => {
    console.log(`✅ Bot conectado como ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    // Seleção de categoria
    if (interaction.isStringSelectMenu() && interaction.customId === 'select_category') {
        const category = interaction.values[0];
        const modal = createReasonModal(category);
        await interaction.showModal(modal);
    }

    // Modal de motivo
    if (interaction.isModalSubmit() && interaction.customId.startsWith('ticket_reason_modal_')) {
        const categoryName = interaction.customId.replace('ticket_reason_modal_', '');
        const reason = interaction.fields.getTextInputValue('ticket_reason');
        
        await interaction.deferReply({ ephemeral: true });
        
        // Criar canal de ticket
        const ticketId = generateTicketId();
        const categoryInfo = CATEGORIES[categoryName] || CATEGORIES.suporte;
        
        const channelName = `${categoryName}-${ticketId.toLowerCase()}`;
        const guild = interaction.guild;
        
        try {
            // Criar canal de ticket
            const ticketChannel = await guild.channels.create({
                name: channelName,
                type: ChannelType.GuildText,
                parent: process.env.TICKET_CATEGORY_ID || null,
                permissionOverwrites: [
                    {
                        id: guild.id,
                        deny: [PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: interaction.user.id,
                        allow: [
                            PermissionFlagsBits.ViewChannel,
                            PermissionFlagsBits.SendMessages,
                            PermissionFlagsBits.ReadMessageHistory
                        ]
                    }
                ]
            });

            // Criar embed do ticket
            const embed = createTicketEmbed(interaction.user, ticketId, reason, categoryName);
            const buttons = createTicketButtons();

            // Enviar mensagem no canal do ticket
            const ticketMessage = await ticketChannel.send({
                embeds: [embed],
                components: buttons
            });

            // Fixar mensagem
            await ticketMessage.pin();

            // Enviar mensagem privada
            const dmEmbed = new EmbedBuilder()
                .setDescription(`**${interaction.user.username}** Iniciamos o seu canal de ticket em: # 📁 • **${channelName}**`)
                .setColor(0x3498DB);

            const dmRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Ir para o Ticket')
                        .setStyle(ButtonStyle.Link)
                        .setURL(`https://discord.com/channels/${guild.id}/${ticketChannel.id}`)
                );

            try {
                await interaction.user.send({
                    embeds: [dmEmbed],
                    components: [dmRow]
                });
            } catch (error) {
                console.log('Não foi possível enviar DM para o usuário');
            }

            await interaction.editReply({
                content: `✅ Ticket criado com sucesso! Verifique suas mensagens diretas.`,
                ephemeral: true
            });

        } catch (error) {
            console.error('Erro ao criar ticket:', error);
            await interaction.editReply({
                content: '❌ Erro ao criar o ticket. Tente novamente mais tarde.',
                ephemeral: true
            });
        }
    }

    // Modal de renomear canal
    if (interaction.isModalSubmit() && interaction.customId === 'ticket_rename_modal') {
        const newName = interaction.fields.getTextInputValue('new_channel_name');
        try {
            await interaction.channel.setName(newName.toLowerCase().replace(/\s+/g, '-'));
            await interaction.reply({
                content: `✅ Canal renomeado para: ${newName}`,
                ephemeral: false
            });
        } catch (error) {
            await interaction.reply({
                content: '❌ Erro ao renomear o canal.',
                ephemeral: true
            });
        }
    }

    // Modal de adicionar membro
    if (interaction.isModalSubmit() && interaction.customId === 'ticket_add_modal') {
        const memberInput = interaction.fields.getTextInputValue('member_id');
        const memberId = memberInput.replace(/[<@!>]/g, '');
        
        try {
            const member = await interaction.guild.members.fetch(memberId);
            await interaction.channel.permissionOverwrites.edit(member.id, {
                ViewChannel: true,
                SendMessages: true,
                ReadMessageHistory: true
            });
            await interaction.reply({
                content: `✅ ${member} foi adicionado ao ticket.`,
                ephemeral: false
            });
        } catch (error) {
            await interaction.reply({
                content: '❌ Membro não encontrado ou erro ao adicionar.',
                ephemeral: true
            });
        }
    }

    // Modal de remover membro
    if (interaction.isModalSubmit() && interaction.customId === 'ticket_remove_modal') {
        const memberInput = interaction.fields.getTextInputValue('remove_member_id');
        const memberId = memberInput.replace(/[<@!>]/g, '');
        
        try {
            const member = await interaction.guild.members.fetch(memberId);
            await interaction.channel.permissionOverwrites.edit(member.id, {
                ViewChannel: false
            });
            await interaction.reply({
                content: `✅ ${member} foi removido do ticket.`,
                ephemeral: false
            });
        } catch (error) {
            await interaction.reply({
                content: '❌ Membro não encontrado ou erro ao remover.',
                ephemeral: true
            });
        }
    }

    // Botões do ticket
    if (interaction.isButton()) {
        const channel = interaction.channel;
        
        switch (interaction.customId) {
            case 'ticket_leave':
                await channel.permissionOverwrites.edit(interaction.user.id, {
                    ViewChannel: false
                });
                await interaction.reply({
                    content: '✅ Você saiu do ticket.',
                    ephemeral: true
                });
                break;

            case 'ticket_claim':
                if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
                    return interaction.reply({
                        content: '❌ Você não tem permissão para assumir tickets.',
                        ephemeral: true
                    });
                }
                await channel.setTopic(`Ticket assumido por ${interaction.user.tag}`);
                await interaction.reply({
                    content: `✅ Ticket assumido por ${interaction.user}`,
                    ephemeral: false
                });
                break;

            case 'ticket_rename':
                if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
                    return interaction.reply({
                        content: '❌ Você não tem permissão para renomear o canal.',
                        ephemeral: true
                    });
                }
                const renameModal = new ModalBuilder()
                    .setCustomId('ticket_rename_modal')
                    .setTitle('Renomear Sala');

                const nameInput = new TextInputBuilder()
                    .setCustomId('new_channel_name')
                    .setLabel('Novo nome do canal:')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('novo-nome')
                    .setRequired(true)
                    .setMaxLength(100);

                const renameRow = new ActionRowBuilder().addComponents(nameInput);
                renameModal.addComponents(renameRow);

                await interaction.showModal(renameModal);
                break;

            case 'ticket_notify':
                const staffRoleId = process.env.STAFF_ROLE_ID;
                const notifyContent = staffRoleId 
                    ? `🔔 <@&${staffRoleId}> Novo ticket precisa de atenção!`
                    : '🔔 Membros da staff foram notificados!';
                await interaction.reply({
                    content: notifyContent,
                    ephemeral: false
                });
                break;

            case 'ticket_add':
                if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
                    return interaction.reply({
                        content: '❌ Você não tem permissão para adicionar membros.',
                        ephemeral: true
                    });
                }
                const addModal = new ModalBuilder()
                    .setCustomId('ticket_add_modal')
                    .setTitle('Adicionar Membro');

                const memberInput = new TextInputBuilder()
                    .setCustomId('member_id')
                    .setLabel('ID do membro ou menção:')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('ID do usuário ou @usuário')
                    .setRequired(true);

                const addRow = new ActionRowBuilder().addComponents(memberInput);
                addModal.addComponents(addRow);

                await interaction.showModal(addModal);
                break;

            case 'ticket_remove':
                if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
                    return interaction.reply({
                        content: '❌ Você não tem permissão para remover membros.',
                        ephemeral: true
                    });
                }
                const removeModal = new ModalBuilder()
                    .setCustomId('ticket_remove_modal')
                    .setTitle('Remover Membro');

                const removeMemberInput = new TextInputBuilder()
                    .setCustomId('remove_member_id')
                    .setLabel('ID do membro ou menção:')
                    .setStyle(TextInputStyle.Short)
                    .setPlaceholder('ID do usuário ou @usuário')
                    .setRequired(true);

                const removeRow = new ActionRowBuilder().addComponents(removeMemberInput);
                removeModal.addComponents(removeRow);

                await interaction.showModal(removeModal);
                break;

            case 'ticket_call':
                try {
                    const voiceChannel = await channel.guild.channels.create({
                        name: `call-${channel.name}`,
                        type: ChannelType.GuildVoice,
                        parent: channel.parent,
                        permissionOverwrites: channel.permissionOverwrites.cache.map(overwrite => ({
                            id: overwrite.id,
                            allow: overwrite.allow,
                            deny: overwrite.deny
                        }))
                    });
                    
                    await interaction.reply({
                        content: `📞 Canal de voz criado: ${voiceChannel}`,
                        ephemeral: false
                    });
                } catch (error) {
                    await interaction.reply({
                        content: '❌ Erro ao criar canal de voz.',
                        ephemeral: true
                    });
                }
                break;

            case 'ticket_close':
                if (!interaction.member.permissions.has(PermissionFlagsBits.ManageChannels)) {
                    return interaction.reply({
                        content: '❌ Você não tem permissão para fechar tickets.',
                        ephemeral: true
                    });
                }
                await interaction.reply({
                    content: '🔒 Fechando ticket em 5 segundos...',
                    ephemeral: false
                });
                setTimeout(async () => {
                    try {
                        await channel.delete();
                    } catch (error) {
                        console.error('Erro ao deletar canal:', error);
                    }
                }, 5000);
                break;
        }
    }
});

// Comando para enviar embed de boas-vindas
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    
    // Comando simples para configurar (você pode mudar isso)
    if (message.content === '!setup-tickets' && message.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
        const welcomeMessage = createWelcomeEmbed();
        await message.channel.send(welcomeMessage);
        await message.delete();
    }
});
// 🔥 SLASH COMMANDS
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'configurar') {
    return interaction.reply({
      content: 'Abrindo configurações...',
      ephemeral: true
    });
  }

  if (interaction.commandName === 'criar_ticket') {
    return interaction.reply({
      content: 'Criando ticket...',
      ephemeral: true
    });
  }
});

client.login(process.env.TOKEN);




