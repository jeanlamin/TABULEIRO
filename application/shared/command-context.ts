/**
 * Passed into every Command/Query handler once the Command Layer lands
 * (Implementation Brief, section 4). No handler exists yet in this slice.
 */
export interface CommandContext {
  readonly userId: string;
  readonly now: () => Date;
}
