import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

async function getLegislatures() {
    const response = await fetch("legislatures.json");
    const data = await response.json();
    const legislatures = data["V"].legislatures;
    return legislatures;
}

async function getCurrents() {
    const response = await fetch("legislatures.json");
    const data = await response.json();
    const currents = data["V"].currents;
    return currents;
}

function getTrapezoidCoordinates(prevCurrent, nextCurrent, height) {
    return [
        [prevCurrent.start, 0],
        [prevCurrent.end, 0],
        [nextCurrent.end, height],
        [nextCurrent.start, height]
    ];
}

async function drawChart() {
    const margin = { top: 25, right: 10, bottom: 10, left: 40 };
    const windowWidth = window.innerWidth - (margin.left + margin.right);
    const windowHeight = window.innerHeight - (margin.top + margin.bottom);

    // Get datas
    let legislatures = await getLegislatures();
    const currents = await getCurrents();
    
    // Map currents to parties
    function mapCurrentsToParties(currents) {
        let partyToCurrent = {};
        currents.forEach(current => {
            for (const [currentName, currentData] of Object.entries(current)) {
                currentData.parties.forEach(party => {
                    for (const [partyName, partyData] of Object.entries(party)) {
                        partyToCurrent[partyName] = {
                            current: currentName,
                            color: currentData.color,
                            full_name: partyData.full_name
                        };
                    }
                });
            }
        });
        return partyToCurrent;
    }

    async function addCurrentsToLegislatures(legislatures, currents) {
        const partyToCurrent = mapCurrentsToParties(currents);

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

    // Create SVG container
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', windowWidth + (margin.left + margin.right))
        .attr('height', windowHeight + (margin.top + margin.bottom))
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Define scales
    const yScale = d3.scaleLinear()
                     .domain([0, totalDuration])
                     .range([0, windowHeight]);

    const xScale = d3.scaleLinear()
                     .domain([0, 100]) // Percentage from 0 to 100
                     .range([0, windowWidth]);

    // Add the horizontal axis (percentage)
    const xAxis = d3.axisTop(xScale)
        .ticks(8)
        .tickFormat(d => d + '%');
    
    svg.append('g')
        .attr('class', 'x axis')
        .call(xAxis)
        .attr('transform', 'translate(0,0)');

    // Cumulated height variable to position each legislature
    let cumulatedHeight = 0;

    legislatures.forEach((legislature, index) => {
        const barHeight = yScale(legislature.duration);

        // Process data to calculate percentage and create stacked data
        const totalSeats = legislature.total_deputes;
        let cumulatedPercentage = 0;

        const stackedParties = Object.keys(legislature.parties).map(partyName => {
            const partyData = legislature.parties[partyName];
            const percentage = (partyData.deputes / totalSeats) * 100;
            const stackedParty = {
                partyName,
                percentage,
                color: partyData.color,
                yPosition: cumulatedHeight, // Place vertically with year
                xStart: cumulatedPercentage, // Place horizontally with cumulated percentage of previous parties
                xEnd: cumulatedPercentage + percentage,
                width: xScale(percentage),
                height: barHeight / 2,
                current: partyData.current
            };
            cumulatedPercentage += percentage;
            return stackedParty;
        });

        // Draw stacked bars
        svg.selectAll(`.bar-${legislature.legislature}`)
            .data(stackedParties)
            .enter()
            .append('rect')
            .attr('class', d => `bar bar-${legislature.legislature} bar-${d.partyName}`)
            .attr('x', d => xScale(d.xStart))
            .attr('y', d => d.yPosition)
            .attr('width', d => d.width)
            .attr('height', d => d.height)
            .attr('fill', d => d.color)
            .append('p', d => partyName);
            
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
                    yPosition: cumulatedHeight + barHeight,
                    xStart: nextCumulatedPercentage,
                    xEnd: nextCumulatedPercentage + percentage,
                    width: xScale(percentage),
                    height: nextBarHeight,
                    current: partyData.current
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

                svg.append('polygon')
                    .attr('points', trapezoidPoints.map(point => point.join(",")).join(" "))
                    .attr('transform', `translate(0,${cumulatedHeight + barHeight / 2})`)
                    .attr('fill', party.color)
                    .attr('opacity', 0.75)
            });
        }

        cumulatedHeight += barHeight;
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

 
}


drawChart();

// function createDOMElement(tag, attributes = {}, textContent) {
// 	// Tag
// 	const element = document.createElement(tag);
// 	// Attributes
// 	for (const [key, value] of Object.entries(attributes)) {
// 		element.setAttribute(key, value);
// 	}
// 	// Text
// 	if (textContent) {
// 		element.textContent = textContent;
// 	}

// 	return element;
// }

// function createTrapezoid(topWidth, bottomWidth, color, height) {
//     if (topWidth <= 0 || bottomWidth <= 0) {
//         console.error('Widths must be greater than zero.');
//         return null;
//     }

//     const trapeze = createDOMElement('div', { class: 'trapeze' });
//     trapeze.style.width = `${bottomWidth}%`;
//     trapeze.style.height = `${height}px`
//     trapeze.style.transform = `skewX(${Math.atan((bottomWidth - topWidth) / (2 * height)) * (180 / Math.PI)}deg)`;
//     trapeze.style.backgroundColor = color;

//     return trapeze;
// }

// async function getLegislatures() {
//     const response = await fetch("legislatures.json");
//     const data = await response.json();
//     const legislatures = data["V"].legislatures;
//     return legislatures;
// }

// function displayLegislature(legislature, nextLegislature) {
//     const year = legislature.legislature;
//     const duration = legislature.duration;
//     const total = legislature.total_deputes;
//     const parties = legislature.parties;
//     const partyNames = Object.keys(parties);
//     const repartition = createDOMElement("div", { "class": "lgslt", "style": `height: ${duration * 15 }px` });
//     const partiesDiv = createDOMElement("div", { "class": "parties" });
//     const transitionDuration = duration * 5;
//     let nextTotal = 0;
//     let nextParties = {};
//     let transition = "";
//     if (nextLegislature) {
//         nextTotal = nextLegislature.total_deputes;
//         nextParties = nextLegislature.parties;
//         transition = createDOMElement("div", { "style": `height: ${transitionDuration}px`, "class": "transition" });
//     }
//     const lgslt = createDOMElement("div", {})

//     partyNames.forEach((party) => {
//         const partyName = party;
//         const partyNumber = parties[party].deputes;
//         const percentage = partyNumber / total * 100;
//         const color = parties[party].color;
//         const partyBlock = createDOMElement("div", { "style": `width:${percentage}%; background-color: ${color}`, "class": "party" }, partyName);
//         let coalition = "";
//         if (parties[party].coalition) {
//             coalition = parties[party].coalition;
//             partyBlock.classList.add("coalition-party");
//         }

//         partiesDiv.appendChild(partyBlock);

//         let nextNumber = 1;
//         if (nextParties[party]) {
//             nextNumber = nextParties[party].deputes;
//             const nextPercentage = nextNumber / nextTotal * 100;
//             const transitionBlock = createTrapezoid(percentage, nextPercentage, color, transitionDuration);
//             transition.appendChild(transitionBlock);
//         }
//     });

//     const yearText = createDOMElement("h2", {}, year);
//     repartition.append(partiesDiv, yearText)
//     lgslt.append(repartition)
//     return lgslt;
// }

// function displayData(legislatures) {
//     const main = document.getElementsByTagName("main")[0];
//     legislatures.forEach((legislature, index) => {
//         const lgslt = displayLegislature(legislature, legislatures[index+1])
//         main.appendChild(lgslt);
//     });
// }

// async function init() {
//     const legislatures = await getLegislatures();
//     displayData(legislatures);
// }
// init();