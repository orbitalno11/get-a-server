Number.prototype.isNotNull = function (): boolean {
  return this !== null;
};

Number.prototype.isSafe = function (): boolean {
  return this !== undefined;
};

Number.prototype.isSafeNotNull = function (): boolean {
  return this.isSafe() && this.isNotNull();
};

Number.prototype.isSafeNumber = function (): boolean {
  return this.isSafeNotNull() && !this.isNaN();
};

Number.prototype.isPositiveValue = function (): boolean {
  return this.isSafeNotNull() && this > 0;
};

Number.prototype.isNegativeValue = function (): boolean {
  return this.isSafeNotNull() && this < 0;
};

Number.prototype.isZeroValue = function (): boolean {
  return this.isSafeNotNull() && this === 0;
};

Number.prototype.isNaN = function (): boolean {
  return Number.isNaN(this);
};

Number.prototype.isBewteen = function (min: number, max: number): boolean {
  return this >= min && this <= max;
};
