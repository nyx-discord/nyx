import Logo from '@/../public/logo.png';
import { SiDiscord } from '@icons-pack/react-simple-icons';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';

export const logo = (
  <>
    <Image
      alt="nyx logo"
      src={Logo}
      className="w-6 md:w-8"
      aria-label="nyx logo"
    />
  </>
);

export const discordInvite = 'https://discord.gg/PQZmwaBZd5';

export const baseOptions: BaseLayoutProps = {
  nav: {
    url: '/home',
    title: (
      <>
        {logo}
        <span className="font-medium [header_&]:text-[15px]">nyx guide</span>
      </>
    ),
  },
  // see https://fumadocs.dev/docs/ui/navigation/links
  links: [
    {
      icon: <SiDiscord />,
      text: 'Discord Server',
      type: 'icon',
      url: discordInvite,
    },
  ],
  githubUrl: 'https://github.com/nyx-discord/nyx',
};
