import type { InteractionTypes } from '@nyx-discord/base';
import type { SessionExceedHandler } from '../../../types/limit/action/SessionExceedHandler.js';
import type { SessionLimitRule } from '../../../types/limit/rule/SessionLimitRule.js';
import { SessionExceedAction } from '../action/SessionExceedAction.js';
import { SessionLimitScope } from '../scope/SessionLimitScope.js';

/** Builder for constructing {@link SessionLimitRule} instances fluently. */
export class SessionLimitRuleBuilder<
  Types extends InteractionTypes = InteractionTypes,
> {
  protected max: SessionLimitRule<Types>['max'] = 1;

  protected scope: SessionLimitRule<Types>['scope'] = SessionLimitScope.User;

  protected onExceed: SessionExceedHandler<Types> = SessionExceedAction.Error;

  /**
   * Sets the maximum number of concurrent sessions allowed within the scope.
   *
   * @default 1
   */
  public setMax(max: number): this {
    this.max = max;
    return this;
  }

  /**
   * Sets the scope within which to enforce the limit.
   *
   * @default SessionLimitScope.User
   */
  public setScope(scope: SessionLimitRule<Types>['scope']): this {
    this.scope = scope;
    return this;
  }

  /**
   * Sets the action to take when the limit is exceeded.
   *
   * @default SessionExceedAction.Error
   */
  public setOnExceed(onExceed: SessionExceedHandler<Types>): this {
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
