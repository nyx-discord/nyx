import { CodeShowcase } from '@/components/CodeShowcase';
import { ServerCodeBlock } from 'fumadocs-ui/components/codeblock.rsc';

const examples: { label: string; code: string }[] = [
  {
    label: 'Commands',
    code: `import { AbstractStandaloneCommand } from '@nyx-discord/djs';
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';

class PingCommand extends AbstractStandaloneCommand {
  protected readonly data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pong!')
    .toJSON();

  public async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply('Pong!');
  }
}

await bot.getCommandManager().addCommands(new PingCommand());`,
  },
  {
    label: 'Schedules',
    code: `import { AbstractSchedule, TypedFields, type Metadata } from '@nyx-discord/djs';

class MemberCountSchedule extends AbstractSchedule {
  protected readonly interval = '*/30 * * * *';

  public async tick(meta: Metadata) {
    const client = TypedFields.getClient(meta);
    if (!client.user) return;

    const members = client.guilds.cache.reduce(
      (acc, guild) => acc + guild.memberCount,
      0,
    );
    
    client.user.setActivity(\`\${members} members\`);
  }
}

await bot.getScheduleManager().addSchedule(new MemberCountSchedule());`,
  },
  {
    label: 'Listeners',
    code: `import { AbstractDJSClientSubscriber, type Metadata } from '@nyx-discord/djs';
import { Events, type GuildMember } from 'discord.js';

class WelcomeSubscriber extends AbstractDJSClientSubscriber<
  typeof Events.GuildMemberAdd
> {
  protected readonly event = Events.GuildMemberAdd;

  public async handleEvent(meta: Metadata, member: GuildMember) {
    await member.send(\`Welcome to \${member.guild.name}!\`);
  }
}

await bot.subscribeToClient(new WelcomeSubscriber());`,
  },
  {
    label: 'HTTP Bots',
    code: `import { createServer } from 'node:http';
import { HttpBot, toNodeListener } from '@nyx-discord/http';

// Mounts on your preferred backend: Express, Fastify, Hono, Next.js, etc.
// Deploys on your VPS, or serverless on Workers, Vercel, Netlify, Lambda, etc. 
// Same commands, events and schedules as on the gateway
const bot = HttpBot.create(() => ({
  applicationId,
  publicKey,
  token,
  logger: console,
  deployCommands: true,
}));

await bot.start();
const client = bot.getClient();

// Point your app's Interactions Endpoint URL here.
createServer(toNodeListener(client)).listen(3000);

// And its Webhook Events URL here
createServer(toNodeListener(client.getWebhookEventHandler())).listen(3001);`,
  },
];

/** The highlighted code examples, in an auto-advancing {@link CodeShowcase}. */
export function CodeExamples() {
  return (
    <CodeShowcase
      items={examples.map((example) => ({
        label: example.label,
        content: (
          <ServerCodeBlock
            code={example.code}
            lang="ts"
            themes={{ light: 'github-light', dark: 'github-dark' }}
            codeblock={{
              className: 'my-0 rounded-none border-0 bg-transparent',
            }}
          />
        ),
      }))}
    />
  );
}
