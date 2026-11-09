import Logo from '@/../public/logo.png';
import { SiDiscord } from '@icons-pack/react-simple-icons';
import { ServerCodeBlock } from 'fumadocs-ui/components/codeblock.rsc';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { ArrowRight, BookOpenText, CodeXml } from 'lucide-react';
import Image from 'next/image';
import type { CSSProperties, ReactNode } from 'react';

const guideUrl = 'https://nyx-discord.github.io/nyx/guide/';
const docsUrl = 'https://nyx-discord.github.io/nyx/docs/';
const discordInvite = 'https://discord.gg/PQZmwaBZd5';

const pingExample = `import { AbstractStandaloneCommand } from '@nyx-discord/djs';
import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';

class PingCommand extends AbstractStandaloneCommand {
  protected readonly data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pong!')
    .toJSON();

  public async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply('Pong!');
  }
}

await bot.getCommandManager().addCommands(new PingCommand());`;

const cards: {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  color: string;
}[] = [
  {
    icon: <CodeXml />,
    title: 'Guide',
    description:
      'Learn how to use nyx, from your first command to replacing its internals, with typechecked examples.',
    href: guideUrl,
    color: 'var(--guide-color)',
  },
  {
    icon: <BookOpenText />,
    title: 'Documentation',
    description:
      'The API reference for every package: each class, interface and type nyx exports.',
    href: docsUrl,
    color: 'var(--docs-color)',
  },
];

export default function HomePage() {
  return (
    <HomeLayout
      nav={{
        title: (
          <>
            <Image alt="nyx logo" src={Logo} className="w-6 md:w-8" />
            <span className="font-medium [header_&]:text-[15px]">nyx</span>
          </>
        ),
      }}
      searchToggle={{ enabled: false }}
      githubUrl="https://github.com/nyx-discord/nyx"
      links={[
        { text: 'Guide', url: guideUrl, active: 'none' },
        { text: 'Documentation', url: docsUrl, active: 'none' },
        {
          icon: <SiDiscord />,
          text: 'Discord Server',
          type: 'icon',
          url: discordInvite,
        },
      ]}
    >
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-20 text-center md:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--nyx-color)_22%,transparent),transparent_65%)]"
        />

        <div className="flex items-center gap-4 md:gap-6">
          <Image src={Logo} alt="nyx logo" className="w-16 md:w-24" priority />
          <h1 className="text-6xl font-bold tracking-tight md:text-8xl">nyx</h1>
        </div>
        <p className="mt-4 max-w-2xl text-lg text-fd-muted-foreground md:text-xl">
          A Discord bot framework that stays out of your way.
        </p>
        <p className="mt-2 max-w-2xl text-sm text-fd-muted-foreground">
          nyx handles commands, events and schedules, leaving your process,
          build step and architecture to you. Supports discord.js or
          @discordjs/core, through the gateway or over HTTP.
        </p>

        <code className="mt-8 rounded-lg border bg-fd-card px-4 py-2 text-sm">
          npm i @nyx-discord/djs discord.js
        </code>

        <div className="mt-8 w-full max-w-3xl text-left">
          <ServerCodeBlock
            code={pingExample}
            lang="ts"
            themes={{ light: 'github-light', dark: 'github-dark' }}
            codeblock={{ title: 'ping.ts' }}
          />
        </div>

        <div className="mt-12 grid w-full max-w-3xl gap-4 text-left sm:grid-cols-2">
          {cards.map((card) => (
            <a
              key={card.href}
              href={card.href}
              className="group flex flex-col rounded-xl border bg-fd-card p-6 transition-colors hover:border-(--card-color) hover:bg-fd-accent/50"
              style={{ '--card-color': card.color } as CSSProperties}
            >
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-(--card-color)/15 text-(--card-color) [&_svg]:size-5">
                {card.icon}
              </div>
              <h2 className="mb-1 flex items-center gap-1 text-lg font-semibold">
                {card.title}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </h2>
              <p className="text-sm text-fd-muted-foreground">
                {card.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      <footer className="border-t py-6 text-center text-sm text-fd-muted-foreground">
        nyx is open source under the MIT license.
      </footer>
    </HomeLayout>
  );
}
