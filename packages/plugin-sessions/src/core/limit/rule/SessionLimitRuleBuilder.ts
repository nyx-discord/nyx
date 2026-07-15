import { SessionExceedAction } from '#src/core/limit/action/SessionExceedAction';
import type { SessionLimitRule } from '#src/core/limit/rule/SessionLimitRule';
import { SessionLimitScope } from '#src/core/limit/scope/SessionLimitScope';

/** Builder for constructing {@link SessionLimitRule} instances fluently. */
export class SessionLimitRuleBuilder {
  private max: SessionLimitRule['max'] = 1;

  private scope: SessionLimitRule['scope'] = SessionLimitScope.User;

  private onExceed: SessionExceedAction = SessionExceedAction.Error;

  public setMax(max: number): this {
    this.max = max;
    return this;
  }

  public setScope(scope: SessionLimitRule['scope']): this {
    this.scope = scope;
    return this;
  }

  public setOnExceed(onExceed: SessionExceedAction): this {
    this.onExceed = onExceed;
    return this;
  }

  /** Builds and returns the {@link SessionLimitRule} instance. */
  public toRule(): SessionLimitRule {
    return {
      max: this.max,
      scope: this.scope,
      onExceed: this.onExceed,
    };
  }
}

/** Callback signature for building a rule via a builder function. */
export type SessionLimitRuleBuilderCallback = (
  rule: SessionLimitRuleBuilder,
) => SessionLimitRule | SessionLimitRuleBuilder;
