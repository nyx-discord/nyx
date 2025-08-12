import { TooltipText } from './TooltipText';

export function CoreMention() {
  return TooltipText({
    text: <code>@core</code>,
    popupContent: (
      <div>
        <p>
          Shorthand for the <code>@nyx-discord/core</code> package, which
          defines the base interfaces that make up nyx.
        </p>
        <p>
          Check the <a href="/home/packages">Packages</a> page for more details.
        </p>
      </div>
    ),
  });
}
