import Logo from '@/../public/logo.png';
import Image from 'next/image';

/** The logo, tagline, description and install command. */
export function Hero() {
  return (
    <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
      <div className="flex items-center gap-4 md:gap-6">
        <Image src={Logo} alt="nyx logo" className="w-16 md:w-24" priority />
        <h1 className="text-6xl font-bold tracking-tight md:text-8xl">nyx</h1>
      </div>
      <p className="mt-6 max-w-xl text-lg text-fd-foreground/85 md:text-xl">
        A Discord bot framework that stays out of your way.
      </p>
      <p className="mt-2 max-w-xl text-sm text-fd-muted-foreground">
        nyx handles the Discord part, leaving your process, build step and
        architecture to you. Use discord.js or @discordjs/core, through the
        gateway or over HTTP.
      </p>
      <p className="mt-2 max-w-xl text-sm text-fd-muted-foreground">
        If you want a single file, no persistence, runtime-generated commands,
        or anything else, it won't interfere, and you can change anything of it.
      </p>

      <code className="mt-6 self-center rounded-lg border border-(--nyx-color)/40 bg-fd-card px-4 py-2 text-sm shadow-[0_0_20px_-4px_color-mix(in_oklab,#4662fe_50%,transparent)]">
        npm i @nyx-discord/djs discord.js
      </code>
    </div>
  );
}
