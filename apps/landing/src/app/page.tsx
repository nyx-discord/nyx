import Logo from '@/../public/logo.png';
import { CodeExamples } from '@/components/CodeExamples';
import { Hero } from '@/components/Hero';
import { LinkCards } from '@/components/LinkCards';
import { discordInvite, docsUrl, guideUrl } from '@/lib/links';
import { SiDiscord } from '@icons-pack/react-simple-icons';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import Image from 'next/image';

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
      <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--nyx-color)_22%,transparent),transparent_65%)]"
        />

        <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.3fr]">
          <Hero />

          <div className="w-full min-w-0">
            <CodeExamples />
          </div>
        </div>

        <LinkCards />
      </section>

      <footer className="border-t py-3 text-center text-sm text-fd-muted-foreground">
        nyx is open source under the MIT license.
      </footer>
    </HomeLayout>
  );
}
