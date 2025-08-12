import { CoreMention } from './CoreMention';
import { TooltipText } from './TooltipText';

export function FrameworkMention() {
  return TooltipText({
    text: <code>@framework</code>,
    popupContent: (
      <div>
        <p>
          Shorthand for the <code>@nyx-discord/framework</code> package, which
          provides the default implementations for <CoreMention />.
        </p>
        <p>
          Check the <a href="/home/packages">Packages</a> page for more details.
        </p>
      </div>
    ),
  });
}
