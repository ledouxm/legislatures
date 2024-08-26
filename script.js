import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

/**
 * Fetch legislatures data from a JSON file
 * @returns {Promise<Array>} An array of legislatures
 */
async function getLegislatures() {
    const response = await fetch("legislatures-output.json");
    const data = await response.json();

    // Give republic id to each legislature
    const republics = data.republics;
    republics.forEach((republic) => {
        const republicName = republic.name;
        republic.legislatures.forEach(legislature => {
            legislature.republic = republicName;
        });
    });
    const legislatures = republics.flatMap(republic => republic.legislatures);
    return legislatures;
}

/**
 * Fetch currents data from a JSON file
 * @returns {Promise<Array>} An array of currents
 */
async function getCurrents() {
    const response = await fetch("currents-output.json");
    const data = await response.json();
    const currents = data.currents;
    return currents;
}

/**
 * Get trapezoid coordinates from two rectangles
 * @param {Object} prevCurrent - The previous current rectangle
 * @param {Object} nextCurrent - The next current rectangle
 * @param {Number} height - The height of the trapezoid
 * @returns {Array} An array of coordinates
 */
function getTrapezoidCoordinates(prevCurrent, nextCurrent, height) {
    return [
        [prevCurrent.start, 0],
        [prevCurrent.end, 0],
        [nextCurrent.end, height],
        [nextCurrent.start, height]
    ];
}

/**
 * Draw the chart
 * @returns {Promise<void>}
 */
async function drawChart() {
    const margin = { top: 30, right: 15, bottom: 10, left: 40 };
    const windowWidth = window.innerWidth - (margin.left + margin.right);
    const windowHeight = window.innerHeight - (margin.top + margin.bottom);

    // Get datas
    let legislatures = await getLegislatures();
    const currents = await getCurrents();
    
    // Map currents to parties
    function mapCurrentsToParties(currents) {
        let partyToCurrent = {};
        currents.forEach(current => {
            current.parties.forEach(party => {
                partyToCurrent[party.name] = {
                    current: current.name,
                    color: current.color,
                    full_name: party.full_name
                };
            });
        });
        return partyToCurrent;
    }

    /**
     * Add currents data to legislatures
     * @param {Array} legislatures - The legislatures data
     * @param {Array} currents - The currents data
     * @returns {Promise<Array>} The updated legislatures data
     */
    async function addCurrentsToLegislatures(legislatures, currents) {
        const partyToCurrent = mapCurrentsToParties(currents);
        const updatedLegislatures = legislatures.map(legislature => {
            let updatedParties = {};
            legislature.parties.forEach(party => {
                const currentData = partyToCurrent[party.name] || {};
                updatedParties[party.name] = {
                    deputes: party.deputes,
                    color: currentData.color || party.color,
                    current: currentData.current || 'Unknown',
                    full_name: currentData.full_name || party.name,
                    coalition: party.coalition || null
                };
            });
            return {
                ...legislature,
                parties: updatedParties
            };
        });
        return updatedLegislatures;

        return legislatures.map(legislature => {
            let updatedParties = {};
            for (const [partyName, partyData] of Object.entries(legislature.parties)) {
                const currentData = partyToCurrent[partyName] || {};
                updatedParties[partyName] = {
                    deputes: partyData.deputes,
                    color: currentData.color || partyData.color,
                    current: currentData.current || 'Unknown',
                    full_name: currentData.full_name || partyName,
                    coalition: partyData.coalition || null
                };
            }
            return {
                ...legislature,
                parties: updatedParties
            };
        });
    }

    legislatures = await addCurrentsToLegislatures(legislatures, currents);

    // Calculate total duration for the y-axis scale
    const totalDuration = d3.sum(legislatures, d => d.duration);
    // Determine minimal height for a legislature
    const minHeight = 28;
    const svgHeight = minHeight * totalDuration + margin.bottom + margin.top;
    const svgWidth = windowWidth + (margin.left + margin.right);
    // Create SVG container
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight)
        .attr('data-height', svgHeight)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Define scales
    const yScale = d3.scaleLinear()
                     .domain([0, totalDuration])
                     .range([0, minHeight * totalDuration]);

    const xScale = d3.scaleLinear()
                     .domain([0, 100]) // Percentage from 0 to 100
                     .range([0, windowWidth]);

    //  Create header svg container
    const header = d3.select('header')
        .append('svg')
        .attr('width', windowWidth + (margin.left + margin.right))
        .attr('height', margin.top)
        .append('g')
        .attr('transform', `translate(${margin.left}, 0)`);

    // Add the horizontal axis (percentage)
    const xAxis = d3.axisTop(xScale)
        .tickValues([0, 25, 50, 75, 100])
        .tickFormat(d => d + '%');
    
    header.append('g')
        .attr('class', 'x axis')
        .call(xAxis)
        .attr('transform', `translate(0, ${margin.top})`);

    // Cumulated height variable to position each legislature
    let cumulatedHeight = 0;
    let previousRepublic = null;

    legislatures.forEach((legislature, index) => {
        const legislatureHeight = yScale(legislature.duration);

        // Process data to calculate percentage and create stacked data
        const totalSeats = legislature.total_deputes;
        let cumulatedPercentage = 0;

        const stackedParties = Object.keys(legislature.parties).map((partyName, i) => {
            const partyData = legislature.parties[partyName];
            const percentage = (partyData.deputes / totalSeats) * 100;
            const coalitionTotal = Object.values(legislature.parties).filter(p => p.coalition === partyData.coalition).reduce((acc, curr) => acc + curr.deputes, 0);
            const coalitionMostImportantPartyColor = Object.values(legislature.parties).filter(p => p.coalition === partyData.coalition).reduce((acc, curr) => acc.deputes > curr.deputes ? acc : curr).color;
            const barHeight = (index === legislatures.length - 1 ? legislatureHeight : legislatureHeight / 2);

            const stackedParty = {
                partyName,
                full_name: partyData.full_name,
                percentage,
                deputes: partyData.deputes,
                totalSeats,
                color: partyData.color,
                yPosition: cumulatedHeight, // Place vertically with year
                xStart: cumulatedPercentage, // Place horizontally with cumulated percentage of previous parties
                xEnd: cumulatedPercentage + percentage,
                width: xScale(percentage),
                height: barHeight,
                current: partyData.current,
                coalition: partyData.coalition,
                coalitionTotal: coalitionTotal,
                coalitionColor: partyData.coalition ? coalitionMostImportantPartyColor : null,
                index: i
            };
            cumulatedPercentage += percentage;
            return stackedParty;
        });

        // Draw stacked bars
        svg.selectAll(`.bar-${legislature.legislature}`)
            .data(stackedParties)
            .enter()
            .append('rect')
            .attr('class', d => {
                const baseClass = `bar bar-${legislature.legislature} bar-${d.current.replace(/[^a-z]+/g, '')}`;
                const coalitionClass = d.coalition ? `coalition coalition-${d.coalition.replace(/[^a-z]+/g, '')}` : '';
                return `${baseClass} ${coalitionClass}`.trim();
            })
            .attr('x', d => xScale(d.xStart))
            .attr('y', d => d.yPosition)
            .attr('width', d => d.width)
            .attr('height', d => d.height)
            .attr('fill', d => d.color)
            .attr('data-color', d => d.color)
            .attr('data-coalition-color', d => d.coalitionColor)
            .attr("shape-rendering", "crispEdges");
        
        // Draw coalition strokes
        stackedParties.forEach((party, i) => {
            if (party.coalition) {
                // Top line
                svg.append('line')
                    .attr('class', `coalition-line top coalition-line-${party.coalition.replace(/[^a-z]+/g, '')}`)
                    .attr('x1', xScale(party.xStart))
                    .attr('x2', xScale(party.xEnd))
                    .attr('y1', party.yPosition)
                    .attr('y2', party.yPosition)
                    .attr('data-y1', party.yPosition)
                    .attr('data-y2', party.yPosition)
                    .attr('data-new-y1', party.yPosition / 2)
                    .attr('data-new-y2', party.yPosition / 2)
                    .attr('stroke', 'rgba(0,0,0,0.5')
                    .attr('stroke-width', 1);
                // Bottom line
                svg.append('line')
                    .attr('class', `coalition-line bottom coalition-line-${party.coalition.replace(/[^a-z]+/g, '')}`)
                    .attr('x1', xScale(party.xStart))
                    .attr('x2', xScale(party.xEnd))
                    .attr('y1', party.yPosition + party.height)
                    .attr('y2', party.yPosition + party.height)
                    .attr('data-y1', party.yPosition + party.height)
                    .attr('data-y2', party.yPosition + party.height)
                    .attr('data-new-y1', party.yPosition / 2 + party.height)
                    .attr('data-new-y2', party.yPosition / 2 + party.height)
                    .attr('stroke', 'rgba(0,0,0,0.5')
                    .attr('stroke-width', 1);

                // Left line
                if (i === 0 || stackedParties[i - 1].coalition !== party.coalition) {
                    svg.append('line')
                        .attr('class', `coalition-line left coalition-line-${party.coalition.replace(/[^a-z]+/g, '')}`)
                        .attr('x1', xScale(party.xStart) + 0.5)
                        .attr('x2', xScale(party.xStart) + 0.5)
                        .attr('y1', party.yPosition)
                        .attr('y2', party.yPosition + party.height)
                        .attr('data-y1', party.yPosition)
                        .attr('data-y2', party.yPosition + party.height)
                        .attr('data-new-y1', party.yPosition / 2)
                        .attr('data-new-y2', party.yPosition / 2 + party.height)
                        .attr('stroke', 'rgba(0,0,0,0.5')
                        .attr('stroke-width', 1);
                }
                // Right line
                if (i === stackedParties.length - 1 || stackedParties[i + 1].coalition !== party.coalition) {
                    svg.append('line')
                        .attr('class', `coalition-line right coalition-line-${party.coalition.replace(/[^a-z]+/g, '')}`)
                        .attr('x1', xScale(party.xEnd) - 0.5)
                        .attr('x2', xScale(party.xEnd) - 0.5)
                        .attr('y1', party.yPosition)
                        .attr('y2', party.yPosition + party.height)
                        .attr('data-y1', party.yPosition)
                        .attr('data-y2', party.yPosition + party.height)
                        .attr('data-new-y1', party.yPosition / 2)
                        .attr('data-new-y2', party.yPosition / 2 + party.height)
                        .attr('stroke', 'rgba(0,0,0,0.5')
                        .attr('stroke-width', 1);
                }
            }
        })
        
        // Add party names to bars
        const minWidthForText = 18;
        const minHeightForText = minHeight;
        svg.selectAll(`.party-${legislature.legislature}`)
            .data(stackedParties.filter(d => d.width > minWidthForText))
            .enter()
            .append('text')
            .attr('class', d => `party-name party-${legislature.legislature} party-${d.partyName.replace(/[^a-z]+/g, '')}`)
            .attr('x', d => xScale(d.xStart))
            .attr('y', d => d.yPosition)
            .attr('dy', '1.1em')
            .attr('dx', '.25em')
            .style('text-anchor', 'start')
            .style('font-size', '9px')
            .text(d => d.partyName)
            .attr('fill', 'black');

        // Add deputy numbers to bars
        svg.selectAll(`.deputies-${legislature.legislature}`)
            .data(stackedParties.filter(d => d.width > minWidthForText && d.height >= minHeightForText))
            .enter()
            .append('text')
            .attr('class', d => `deputies-number deputies-${legislature.legislature} deputies-${d.partyName.replace(/[^a-z]+/g, '')}`)
            .attr('x', d => xScale(d.xStart))
            .attr('y', d => d.yPosition + 11)
            .attr('dy', '1.1em')
            .attr('dx', '.25em')
            .style('text-anchor', 'start')
            .style('opacity', 0.5)
            .style('font-size', '8px')
            .text(d => d.deputes)
            .attr('fill', 'black');

        // Draw transition between bars to the next legislature
        if (index < legislatures.length - 1) {
            const nextLegislature = legislatures[index + 1];
            const nextBarHeight = yScale(nextLegislature.duration);
            const nextTotalSeats = nextLegislature.total_deputes;
            let nextCumulatedPercentage = 0;

            const nextStackedParties = Object.keys(nextLegislature.parties).map(partyName => {
                const partyData = nextLegislature.parties[partyName];
                const percentage = (partyData.deputes / nextTotalSeats) * 100;
                const stackedParty = {
                    partyName,
                    percentage,
                    color: partyData.color,
                    yPosition: cumulatedHeight + legislatureHeight,
                    xStart: nextCumulatedPercentage,
                    xEnd: nextCumulatedPercentage + percentage,
                    width: xScale(percentage),
                    height: nextBarHeight,
                    current: partyData.current,
                    coalitionColor: partyData.coalitionColor,
                };
                nextCumulatedPercentage += percentage;
                return stackedParty;
            });

            // Draw transition polygons
            stackedParties.forEach((party, index) => {
                let nextParty = nextStackedParties.find(nextParty => nextParty.current === party.current);

                let nextXStart = 0;
                let nextXEnd = windowWidth - margin.right;
                
                if (!nextParty) {
                    let nextLegPreviousParty = null;
                    let nextLegNextParty = null;
                    
                    let findPrevIndex = index - 1;
                    while (!nextLegPreviousParty && findPrevIndex >= 0) {
                        nextLegPreviousParty = nextStackedParties[findPrevIndex];
                        findPrevIndex--
                    }

                    let findNextIndex = index;
                    while (!nextLegNextParty && findNextIndex < nextStackedParties.length) {
                        nextLegNextParty = nextStackedParties[findNextIndex];
                        findNextIndex++
                    }
                    nextXStart = nextLegPreviousParty ? nextLegPreviousParty.xEnd : 0;
                    nextXEnd = nextLegNextParty ? nextLegNextParty.xStart : windowWidth - margin.right;
                } else {
                    nextXStart = nextParty.xStart;
                    nextXEnd = nextParty.xEnd;
                }

                const trapezoidPoints = getTrapezoidCoordinates(
                    { start: xScale(party.xStart), end: xScale(party.xEnd) },
                    { start: xScale(nextXStart), end: xScale(nextXEnd) },
                    party.height
                );

                const yStart = cumulatedHeight + legislatureHeight / 2;

                svg.append('polygon')
                    .attr('class', `transition-${legislature.legislature} transition-${party.current.replace(/[^a-z]+/g, '')} ${party.coalition ? 'transition-coalition' : ''}`)
                    .attr('points', trapezoidPoints.map(point => point.join(",")).join(" "))
                    .attr('data-height', party.height)
                    .attr('data-next-x-start', xScale(nextXStart))
                    .attr('data-next-x-end', xScale(nextXEnd))
                    .attr('transform', `translate(0,${yStart})`)
                    .attr('data-y-start', yStart)
                    .attr('fill', party.color)
                    .attr('opacity', 0.75)
                    .attr('data-color', party.color)
                    .attr('data-coalition-color', party.coalitionColor)
                    .attr("shape-rendering", "crispEdges");
            });
        }

        // Add republics names to the chart
        // Each time a legislature has a new republic, add a text with the republic name
        if (legislature.republic !== previousRepublic) {
            previousRepublic = legislature.republic;
            let previousHeight = 0;
            if (index - 1 > 0) {
                previousHeight = yScale(legislatures[index - 1].duration) || 0;
            }
            const fontSize = 10;
            const textYMiddle = fontSize / 4;
            const republicYPosition = cumulatedHeight - (previousHeight / 4) + textYMiddle;

            const republicGroup = svg.selectAll(`.republic-group republic-group-${legislature.republic}`)
                .data([legislature])
                .enter()
                .append('g')
                .attr('class', `republic-group republic-group-${legislature.republic}`)

            // Add a line to separate republics
            republicGroup.append('line')
                .attr('class', `republic-line republic-line-${legislature.republic}`)
                .attr('x1', 0)
                .attr('x2', windowWidth)
                .attr('y1', cumulatedHeight)
                .attr('y2', cumulatedHeight)
                .attr('stroke', 'black')
                .attr('stroke-dasharray', '15,15')
                .attr('stroke-width', 0.5);

            // Add republic name
            republicGroup.append('text')
                .attr('class', `republic-name republic-${legislature.republic}`)
                .attr('x', windowWidth / 2)
                .attr('y', republicYPosition)
                .style('text-anchor', 'middle')
                .style('font-size', `${fontSize}px`)
                .text(`${legislature.republic}e République`)
                .attr('fill', 'black');

        }

        cumulatedHeight += legislatureHeight;
    });    

    // Select tooltip and add event for each rectangle
    const body = document.querySelector('body');
    body.classList.add('interactions-allowed');
    const tooltip = d3.select("#tooltip");

    svg.selectAll('rect')
        .on('mouseover', function (event, d) {
            // Check if interactions are allowed
            if (body.classList.contains('interactions-allowed')) {
                // Create tooltip rectangle content
                const deputiesText = `<p><span>Député${d.deputes > 1 ? 's' : ''} :</span> <span><strong>${d.deputes}</strong> / ${d.totalSeats}</span> <span class="percentageValue">(${d.percentage.toFixed(1)}%)</span></p>`;
                const currentText = `<p><span>Courant :</span> <span class="currentColor" style="background-color: ${d.color}"></span> ${d.current}</p>`;
                const coalitionText = d.coalition ? `<p><span>Coalition :</span> <span class="currentColor" style="background-color: ${d.coalitionColor}"></span> ${d.coalition}</p>` : '';
                const coalitionDeputiesText = d.coalition ? `<p><span>Députés de la coalition :</span> <strong>${d.coalitionTotal}</strong> <span class="percentageValue">(${((d.coalitionTotal / d.totalSeats) * 100).toFixed(1)}%)</span></p>` : '';
    
                // Set tooltip content
                tooltip.html(`<p>${d.full_name}</p>
                            ${currentText}
                            ${deputiesText}
                            ${coalitionText}
                            ${coalitionDeputiesText}
                            `);
    
                // Create tooltip transition
                tooltip.transition()
                            .duration(200)
                            .style('opacity', 1)
                            .style('visibility', 'visible');
                
                // Reduce bar opacity
                d3.select(this).transition()
                    .duration(200)
                    .style('fill-opacity', 0.9);
            }
        })
        .on('mousemove', function (event) {
            if (body.classList.contains('interactions-allowed')) {
                // Move tooltip with cursor
                const tooltipWidth = tooltip.node().offsetWidth;
                const tooltipHeight = tooltip.node().offsetHeight;
                // set tooltip classes to top and left by default
                tooltip.classed('top', true);
                tooltip.classed('left', true);
                tooltip.classed('right', false);
                tooltip.classed('bottom', false);
    
                let tooltipX = event.pageX + 5;
                let tooltipY = event.pageY;
    
                if (tooltipX + tooltipWidth > windowWidth) {
                    tooltipX = event.pageX - tooltipWidth - 5;
                    tooltip.classed('left', false);
                    tooltip.classed('right', true);
                }
    
                if (tooltipY + tooltipHeight > windowHeight) {
                    tooltipY = event.pageY - tooltipHeight;
                    tooltip.classed('top', false);
                    tooltip.classed('bottom', true);
                }
    
    
                tooltip.style('top', `${tooltipY}px`)
                        .style('left', `${tooltipX}px`);
            }
        })
        .on('mouseout', function(event) {
            if (body.classList.contains('interactions-allowed')) {
                // make the tooltip fade away
                tooltip.transition()
                    .duration(200)
                    .style('opacity', 0)
                    .style('visibility', 'hidden');
    
                d3.select(this).transition()
                    .duration(200)
                    .style('fill-opacity', 1);
            }
        });
        

    // Add the vertical axis (years)
    const yAxis = d3.axisLeft(yScale)
                    .tickValues(legislatures.map((legislature, i) => {
                        return (i === 0 ? 0 : d3.sum(legislatures.slice(0, i), d => d.duration));
                    }))
                    .tickFormat((d, i) => legislatures[i].legislature);

    svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);

    // Add a dashed line at 50% of the chart
    svg.append('line')
        .attr('x1', xScale(50))
        .attr('x2', xScale(50))
        .attr('y1', 0)
        .attr('y2', totalDuration * minHeight)
        .attr('opacity', 0.15)
        .attr('stroke', 'black')
        .attr('stroke-dasharray', '10,20')
        .attr('stroke-width', 0.5);      
        
    // Add a checkbox to toggle coalition visibility
    const coalitionButton = d3.select('#coalition-checkbox');
    coalitionButton.on('click', function() {
        const coalitionBars = document.querySelectorAll('.coalition');
        coalitionBars.forEach(bar => {
            bar.classList.toggle('coalition-colored');
            
            bar.style.stroke = bar.classList.contains('coalition-colored') ? 'black' : 'none';
            bar.style.strokeWidth = bar.classList.contains('coalition-colored') ? 0.2 : 0;

            if (bar.dataset.color !== bar.dataset.coalitionColor) {
                bar.style.fill = bar.classList.contains('coalition-colored') ? bar.dataset.coalitionColor : bar.dataset.color;
                bar.style.opacity = bar.classList.contains('coalition-colored') ? 0.8 : 1;
            }
        });

        const transitionPolygons = document.querySelectorAll('polygon.transition-coalition');
        transitionPolygons.forEach(polygon => {
            polygon.classList.toggle('coalition-colored');

            polygon.style.stroke = polygon.classList.contains('coalition-colored') ? 'black' : 'none';
            polygon.style.strokeWidth = polygon.classList.contains('coalition-colored') ? 0.1 : 0;

            if (polygon.dataset.color !== polygon.dataset.coalitionColor) {
                polygon.style.fill = polygon.classList.contains('coalition-colored') ? polygon.dataset.coalitionColor : polygon.dataset.color;
                polygon.style.opacity = polygon.classList.contains('coalition-colored') ? 0.65 : 0.75;
            }
        });
    });

    // Add a checkbox to toggle transitions visibility
    const transitionButton = d3.select('#transitions-checkbox');
    const transitionDuration = 750;
    const transitionEase = d3.easeQuadInOut;

    transitionButton.on('click', function() {
        const body = document.querySelector('body');
        body.classList.toggle('transitions-hidden');
        const isHidden = body.classList.contains('transitions-hidden');

        // Divide by 2 y axis height to have each legislature height divided by 2
        const newYScale = d3.scaleLinear()
        .domain([0, totalDuration])
        .range([0, (minHeight * totalDuration) / 2]);

        // Transition y axis
        svg.select('.y.axis')
        .transition()
        .duration(transitionDuration)
        .ease(transitionEase)
        .call(d3.axisLeft(isHidden ? newYScale : yScale)
            .tickValues(legislatures.map((legislature, i) => {
                return (i === 0 ? 0 : d3.sum(legislatures.slice(0, i), d => d.duration));
            }))
            .tickFormat((d, i) => legislatures[i].legislature));

        // Transition polygons
        svg.selectAll('polygon')
            .transition()
            .duration(transitionDuration)
            .ease(transitionEase)
            .attr('points', function() {
                const xStart = parseFloat(this.getAttribute('points').split(' ')[0].split(',')[0]);
                const xEnd = parseFloat(this.getAttribute('points').split(' ')[1].split(',')[0]);
                const xNextStart = parseFloat(this.getAttribute('data-next-x-start'));
                const xNextEnd = parseFloat(this.getAttribute('data-next-x-end'));
                const height = parseFloat(this.getAttribute('data-height'));
                return getTrapezoidCoordinates(
                    { start: xStart, end: xEnd },
                    { start: xNextStart, end: xNextEnd },
                    isHidden ? 0 : height
                ).map(point => point.join(",")).join(" ")
            })
            .attr('transform', function() {
                const yStart = parseFloat(this.getAttribute('data-y-start'));
                const height = parseFloat(this.getAttribute('data-height'));
                const yPosition = yStart - height;
                const yNewStart = height + (yPosition / 2);
                return isHidden ? `translate(0,${yNewStart})` : `translate(0,${yStart})`;
            });

        // Transition bars
        svg.selectAll('rect')
            .transition()
            .duration(transitionDuration)
            .ease(transitionEase)
            .attr('y', d => isHidden ? d.yPosition / 2 : d.yPosition);

        // Transition party names
        svg.selectAll('.party-name')
            .transition()
            .duration(transitionDuration)
            .ease(transitionEase)
            .attr('y', d => isHidden ? d.yPosition / 2 : d.yPosition);

        // Transition deputies numbers
        svg.selectAll('.deputies-number')
            .transition()
            .duration(transitionDuration)
            .ease(transitionEase)
            .attr('y', d => (isHidden ? d.yPosition / 2 : d.yPosition) + 11);

        // Transition coalition lines
        svg.selectAll('.coalition-line')
            .transition()
            .duration(transitionDuration)
            .ease(transitionEase)
            .attr('y1', function() {
                return isHidden ? parseFloat(this.getAttribute('data-new-y1')) : parseFloat(this.getAttribute('data-y1'));
            })
            .attr('y2', function() {
                return isHidden ? parseFloat(this.getAttribute('data-new-y2')) : parseFloat(this.getAttribute('data-y2'));
            });
        
        // Resize svg container height
        const svgToResize = document.querySelector('#chart svg');
        const svgHeight = parseFloat(svgToResize.getAttribute('data-height'));
        svgToResize.setAttribute('height', isHidden ? (svgHeight / 2) + 24 : svgHeight);
        svgToResize.setAttribute('style', `transition-duration: ${transitionDuration}ms; transition-timing-function: ${transitionEase};`);

        // Scroll to the top of the page
        if (isHidden) {
            window.scrollTo({top: 0, behavior: 'smooth'});
        }

        // Do not allow interactions during transition
        body.classList.remove('interactions-allowed');  
        setTimeout(() => {
            body.classList.add('interactions-allowed');
        }, transitionDuration);
    });

    // Add a checkbox for each current to make it more visible
    const currentsList = document.querySelector('#currents-list');
    currents.forEach(current => {
        const currentCheckbox = document.createElement('input');
        currentCheckbox.type = 'checkbox';
        currentCheckbox.id = `current-${current.name.replace(/[^a-z]+/g, '')}`;
        currentCheckbox.checked = true;
        currentCheckbox.addEventListener('change', function() {
            const currentBars = document.querySelectorAll(`.bar-${current.name.replace(/[^a-z]+/g, '')}`);
            currentBars.forEach(bar => {
                bar.style.display = this.checked ? 'block' : 'none';
            });

            const transitionPolygons = document.querySelectorAll(`.transition-${current.name.replace(/[^a-z]+/g, '')}`);
            transitionPolygons.forEach(polygon => {
                polygon.style.display = this.checked ? 'block' : 'none';
            });
        });

        const currentLabel = document.createElement('label');
        currentLabel.htmlFor = `current-${current.name.replace(/[^a-z]+/g, '')}`;
        currentLabel.textContent = current.name;

        const currentColorSpan = document.createElement('span');
        currentColorSpan.classList.add('currentColor');
        currentColorSpan.style.backgroundColor = current.color;
        currentLabel.prepend(currentColorSpan);

        const listItem = document.createElement('div');
        listItem.classList.add('current-list-item');
        listItem.appendChild(currentCheckbox);
        listItem.appendChild(currentLabel);

        currentsList.appendChild(listItem);
    }); 
}

drawChart();