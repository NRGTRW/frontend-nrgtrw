// Deterministic PRNG using mulberry32 algorithm
// https://github.com/bryc/code/blob/master/jshash/PRNGs.md#mulberry32

export class Mulberry32 {
  private state: number;

  constructor(seed: number) {
    this.state = seed;
  }

  next(): number {
    this.state |= 0;
    this.state = (this.state + 0x6d2b79f5) | 0;
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  nextInt(max: number): number {
    return Math.floor(this.next() * max);
  }

  nextFloat(): number {
    return this.next();
  }

  nextBoolean(): boolean {
    return this.next() < 0.5;
  }

  // Generate a random choice from an array
  nextChoice<T>(array: T[]): T {
    return array[this.nextInt(array.length)];
  }

  // Generate a random number in a range
  nextRange(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  // Shuffle an array in place
  shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = this.nextInt(i + 1);
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Generate a weighted random choice
  nextWeightedChoice<T>(choices: { value: T; weight: number }[]): T {
    const totalWeight = choices.reduce((sum, choice) => sum + choice.weight, 0);
    let random = this.next() * totalWeight;
    
    for (const choice of choices) {
      random -= choice.weight;
      if (random <= 0) {
        return choice.value;
      }
    }
    
    return choices[choices.length - 1].value;
  }
}

// Utility functions for common PRNG operations
export function createSeededRandom(seed: number): Mulberry32 {
  return new Mulberry32(seed);
}

export function generateSeed(): number {
  return Math.floor(Math.random() * 0xffffffff);
}

export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Test function to verify deterministic behavior
export function testDeterministic(): boolean {
  const seed = 12345;
  const rng1 = new Mulberry32(seed);
  const rng2 = new Mulberry32(seed);
  
  const results1 = Array.from({ length: 10 }, () => rng1.next());
  const results2 = Array.from({ length: 10 }, () => rng2.next());
  
  return JSON.stringify(results1) === JSON.stringify(results2);
}
