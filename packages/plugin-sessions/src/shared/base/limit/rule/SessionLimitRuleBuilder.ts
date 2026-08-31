import type { InteractionTypes } from '@nyx-discord/types';
import { SessionExceedAction } from '../action/SessionExceedAction.js';
import type { SessionLimitRule } from '../../../types/limit/rule/SessionLimitRule.js';
import { SessionLimitScope } from '../scope/SessionLimitScope.js';

/** Builder for constructing {@link SessionLimitRule} instances fluently. */
export class SessionLimitRuleBuilder<
  Types extends InteractionTypes = InteractionTypes,
> {
  private max: SessionLimitRule<Types>['max'] = 1;

  private scope: SessionLimitRule<Types>['scope'] = SessionLimitScope.User;

  private onExceed: SessionExceedAction<Types> =
    SessionExceedAction.Error as unknown as SessionExceedAction<Types>;

  public setMax(max: number): this {
    this.max = max;
    return this;
  }

  public setScope(scope: SessionLimitRule<Types>['scope']): this {
    this.scope = scope;
    return this;
  }

  public setOnExceed(onExceed: SessionExceedAction<Types>): this {
    this.onExceed = onExceed;
    return this;
  }

  /** Builds and returns the {@link SessionLimitRule} instance. */
  public toRule(): SessionLimitRule<Types> {
    return {
      max: this.max,
      scope: this.scope,
      onExceed: this.onExceed,
    };
  }
}

/** Callback signature for building a rule via a builder function. */
export type SessionLimitRuleBuilderCallback<
  Types extends InteractionTypes = InteractionTypes,
> = (
  rule: SessionLimitRuleBuilder<Types>,
) => SessionLimitRule<Types> | SessionLimitRuleBuilder<Types>;
