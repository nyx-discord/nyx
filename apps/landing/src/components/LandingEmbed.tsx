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
          nyx handles the Discord part, leaving your process, build step and
          architecture to you. Supports `discord.js` or `@discordjs/core`,
          through the gateway or HTTP.
        </TextDisplay>
      </Container>
    </ComponentEmbed>
  );
}
