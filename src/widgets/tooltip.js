if (!('ontouchstart' in window)) {
  {
    const tooltip = $('[data-toggle="tooltip"]');
    if (tooltip) {
      tooltip.tooltip({ container: 'body' });
    }
  }
}
