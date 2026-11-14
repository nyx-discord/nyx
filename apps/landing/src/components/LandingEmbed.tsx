import { Container, Separator, TextDisplay } from 'discord-component-embed';
import { ComponentEmbed } from 'discord-component-embed/react';

export function LandingEmbed() {
  return (
    <ComponentEmbed>
      <Container accentColor={0x7d91fe}>
        <TextDisplay>
          ## {'<:nyx:1571031709615394977>'} nyx{'\n'}
          -# A TypeScript Discord bot framework that stays out of your way.
        </TextDisplay>
        <Separator divider={true} />
        <TextDisplay>
          Let nyx handle commands, events and schedules, leaving your process,
          design, build step and deployment architecture to you. Supports
          `discord.js` or `@discordjs/core`, through the gateway or HTTP.
        </TextDisplay>
      </Container>
    </ComponentEmbed>
  );
}
