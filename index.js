require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ]
});


// =====================================
// ENV
// =====================================

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const GUILD_ID = process.env.GUILD_ID;


// =====================================
// تحكم يدوي بالحالة
// true = Online
// false = Offline
// =====================================

const SERVER_ONLINE = true;


// =====================================
// الصور
// =====================================

const LOGO =
'https://i.postimg.cc/SQg6NBWr/download.gif';


// =====================================

client.once('clientReady', async () => {

    console.log(`${client.user.tag} Online`);

    const channel = await client.channels.fetch(CHANNEL_ID);

    async function updatePanel() {

        try {

            // =====================================
            // السيرفر
            // =====================================

            const guild = await client.guilds.fetch(GUILD_ID);

            await guild.members.fetch();

            // =====================================
            // عدد الاونلاين
            // =====================================

            const onlineMembers = guild.members.cache.filter(
    member =>
        member.presence &&
        member.presence.status !== 'offline'
).size;

            // =====================================
            // عدد الاعضاء
            // =====================================

            const totalMembers = guild.memberCount;


            // =====================================
            // الحالة
            // =====================================

            const statusText = SERVER_ONLINE
                ? '🟢 Online '
                : '🔴 Offline';


            // =====================================
            // لون الـ Embed
            // =====================================

            const embedColor = SERVER_ONLINE
                ? '#00ff0d'
                : '#ff0000';


            // =====================================
            // EMBED
            // =====================================

            const embed = new EmbedBuilder()

            .setColor(embedColor)

            .setAuthor({
                name: 'Assassins Server States',
                iconURL: LOGO
            })

            .setTitle(' Assassins Communty ')

            .setThumbnail(LOGO)

            .addFields(

                {
                    name: 'حالة السيرفر',
                    value: `\`\`\`${statusText}\`\`\``,
                    inline: true
                },

                {
                    name: 'الأعضاء المتصلين 👥',
                    value: `\`\`\`${onlineMembers} / ${totalMembers}\`\`\``,
                    inline: true
                },

                {
                    name: 'دخول السيرفر 🌍',
                    value: `\`\`\`https://discord.gg/7VtTx6cJy\`\`\``,
                    inline: false
                }

            )

            .setImage('https://i.postimg.cc/cLnwh6Vy/file-00000000071071f482e5b9cfefa85b2f.png')

            .setFooter({
                text: 'Updated every minute'
            })

            .setTimestamp();


            // =====================================
            // الأزرار
            // =====================================

            const row = new ActionRowBuilder()
            .addComponents(

                new ButtonBuilder()
                .setLabel('💬 دخول السيرفر')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.gg/7VtTx6cJy')
            );


            // =====================================
            // تعديل الرسالة
            // =====================================

            const messages = await channel.messages.fetch({
                limit: 10
            });

            const oldMessage = messages.find(
                m => m.author.id === client.user.id
            );

            if (oldMessage) {

                await oldMessage.edit({
                    embeds: [embed],
                    components: [row]
                });

            } else {

                await channel.send({
                    embeds: [embed],
                    components: [row]
                });

            }

        } catch (err) {

            console.log(err);

        }

    }

    updatePanel();

    setInterval(updatePanel, 60000);

});

client.login(TOKEN);
