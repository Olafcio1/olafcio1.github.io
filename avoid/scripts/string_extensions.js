String.prototype.partition = function partition(sep) {
  return [this.substring(0, this.indexOf(sep)), sep, this.substring(this.indexOf(sep) + sep.length)];
}
