import { Injectable } from '@angular/core';

const PREFIX = `mp_`;

/**
 * Generates unique ids
 */
@Injectable({
  providedIn: `root`,
})
export class MiniProfilerIdService {
  private static autoId = 0;

  generate(): string {
    return `${PREFIX}${MiniProfilerIdService.autoId++}${Date.now()}`;
  }
}
