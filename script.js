function createDOMElement(tag, attributes = {}, textContent) {
	// Tag
	const element = document.createElement(tag);
	// Attributes
	for (const [key, value] of Object.entries(attributes)) {
		element.setAttribute(key, value);
	}
	// Text
	if (textContent) {
		element.textContent = textContent;
	}

	return element;
}

function createTrapezoid(topWidth, bottomWidth, color, height) {
    if (topWidth <= 0 || bottomWidth <= 0) {
        console.error('Widths must be greater than zero.');
        return null;
    }

    const trapeze = createDOMElement('div', { class: 'trapeze' });
    trapeze.style.width = `${bottomWidth}%`;
    trapeze.style.height = `${height}px`
    trapeze.style.transform = `skewX(${Math.atan((bottomWidth - topWidth) / (2 * height)) * (180 / Math.PI)}deg)`;
    trapeze.style.backgroundColor = color;

    return trapeze;
}

async function getLegislatures() {
    const response = await fetch("legislatures.json");
    const data = await response.json();
    const legislatures = data["V"].legislatures;
    return legislatures;
}

function displayLegislature(legislature, nextLegislature) {
    const year = legislature.legislature;
    const duration = legislature.duration;
    const total = legislature.total_deputes;
    const parties = legislature.parties;
    const partyNames = Object.keys(parties);
    const repartition = createDOMElement("div", { "class": "lgslt", "style": `height: ${duration * 15 }px` });
    const partiesDiv = createDOMElement("div", { "class": "parties" });
    const transitionDuration = duration * 5;
    let nextTotal = 0;
    let nextParties = {};
    let transition = "";
    if (nextLegislature) {
        nextTotal = nextLegislature.total_deputes;
        nextParties = nextLegislature.parties;
        transition = createDOMElement("div", { "style": `height: ${transitionDuration}px`, "class": "transition" });
    }
    const lgslt = createDOMElement("div", {})

    partyNames.forEach((party) => {
        const partyName = party;
        const partyNumber = parties[party].deputes;
        const percentage = partyNumber / total * 100;
        const color = parties[party].color;
        const partyBlock = createDOMElement("div", { "style": `width:${percentage}%; background-color: ${color}`, "class": "party" }, partyName);
        let coalition = "";
        if (parties[party].coalition) {
            coalition = parties[party].coalition;
            partyBlock.classList.add("coalition-party");
        }

        partiesDiv.appendChild(partyBlock);

        let nextNumber = 1;
        if (nextParties[party]) {
            nextNumber = nextParties[party].deputes;
            const nextPercentage = nextNumber / nextTotal * 100;
            const transitionBlock = createTrapezoid(percentage, nextPercentage, color, transitionDuration);
            transition.appendChild(transitionBlock);
        }
    });

    const yearText = createDOMElement("h2", {}, year);
    repartition.append(partiesDiv, yearText)
    lgslt.append(repartition)
    return lgslt;
}

function displayData(legislatures) {
    const main = document.getElementsByTagName("main")[0];
    legislatures.forEach((legislature, index) => {
        const lgslt = displayLegislature(legislature, legislatures[index+1])
        main.appendChild(lgslt);
    });
}

async function init() {
    const legislatures = await getLegislatures();
    displayData(legislatures);
}
init();