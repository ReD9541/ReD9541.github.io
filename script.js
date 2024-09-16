document.addEventListener("DOMContentLoaded", () => {
    const factButton = document.getElementById('fact-button');
    const factText = document.getElementById('fact-text');
    const facts = [
        "Did you know? Vector art can be scaled infinitely without losing quality!",
        "Fun Fact: Copyright lasts for the life of the author plus 70 years.",
        "Did you know? Adobe Illustrator was first released in 1987!",
        "Fun Fact: You can't legally use more than 10% of a copyrighted work without permission.",
        "Did you know? The Pen tool in Illustrator creates vector paths that can be adjusted infinitely."
    ];

    factButton.addEventListener('click', () => {
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        factText.textContent = randomFact;
    });
});
