document.addEventListener('DOMContentLoaded', () => {
    // Create and append the tooltip element once
    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    document.body.appendChild(tooltip);

    // Function to parse Markdown and convert \n to line breaks
    const parseMarkdown = (text) => {
        return text
            .replace(/\*\*\*([^*]+)\*\*\*/g, '<b><i>$1</i></b>') // Italibold
            .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>') // Bold
            .replace(/\*([^*]+)\*/g, '<i>$1</i>') // Italic
            // .replace(/\[([^]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>') // Links
            .replace(/\!\[([^]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">') // Images
            .replace(/\{lb\}/g, '<br>');
    };

    // Event delegation for elements with the "tada" attribute
    document.addEventListener('mouseover', (event) => {
        const target = event.target;
        if (target.hasAttribute('tada')) {
            const tooltipText = target.getAttribute('tada');
            tooltip.innerHTML = parseMarkdown(tooltipText);
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

    // Function to update the tooltip position based on cursor movement
    const updateTooltipPosition = (event) => {
        const offset = 15; // Distance from the cursor
        tooltip.style.left = `${event.pageX + offset}px`;
        tooltip.style.top = `${event.pageY + offset}px`;
    };
});