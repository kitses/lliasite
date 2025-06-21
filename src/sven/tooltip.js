document.addEventListener('DOMContentLoaded', () => {
  // create and append the tooltip element once
  const tooltip = document.createElement('div');
  tooltip.classList.add('tooltip');
  tooltip.setAttribute('aria-ignore', 'true');
  document.body.appendChild(tooltip);

  // function to update the tooltip position based on cursor movement
  const updateTooltipPosition = (event) => {
    const offset = 15;  // distance from cursor
    tooltip.style.left = `${event.pageX + offset}px`;
    tooltip.style.top = `${event.pageY + offset}px`;
  };

  // event delegation for elements with the tada attribute
  document.addEventListener('mouseover', (event) => {
    const target = event.target;
    if (target.hasAttribute('tada')) {
      const tooltipText = target.getAttribute('tada');
      tooltip.innerHTML = tooltipText;
      tooltip.style.display = 'block';
      updateTooltipPosition(event);
    }
  });

  document.addEventListener('mousemove', (event) => {
    if (tooltip.style.display === 'block') {
      updateTooltipPosition(event);
    }
  });

  document.addEventListener('mouseout', (event) => {
    if (event.target.hasAttribute('tada')) {
      tooltip.style.display = 'none';
    }
  });
});
