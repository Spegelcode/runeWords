
async function loadRunesAndRunewords() {
  try {
    //här hämtar ci data från json
    const [runesResponse, runewordsResponse] = await Promise.all([
      fetch('runes.json'),
      fetch('runewords.json'),
    ]);

    //vi gör json filen till en objekt
    const runes = await runesResponse.json();
    const runewords = await runewordsResponse.json();


    console.log('Runewords:', runewords); 

    // här pratar vi med renderRunes för att den ska kunna generera runor och matcha till runewords
    renderRunes(runes);
    setupRuneFilter(runes, runewords);

    // error catch
  } catch (error) {
    console.error('Error loading runes and runewords:', error);
  }
}


function renderRunes(runes) {
  const container = document.getElementById('runes-container');
  container.innerHTML = ''; 

  runes.forEach((rune) => {
    const runeDiv = document.createElement('div');
    runeDiv.classList.add('rune', rune.rarity.toLowerCase());

    runeDiv.innerHTML = `
      <input type="checkbox" id="rune-${rune.id}" data-name="${rune.name}" />
      <label for="rune-${rune.id}">
        <strong>${rune.name}</strong> <hr> (Level: ${rune.level || 'N/A'}<hr> Rarity: ${rune.rarity}<br>
        Effects: ${rune.effects.map((effect) => `<span>${effect}</span>`).join(', ')}
      </label>
    `;

    container.appendChild(runeDiv);
  });
}


function setupRuneFilter(runes, runewords) {
  const checkboxes = document.querySelectorAll('#runes-container input[type="checkbox"]');

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {

      const selectedRunes = Array.from(checkboxes)
        .filter((box) => box.checked)
        .map((box) => box.getAttribute('data-name'));

      console.log('Selected Runes:', selectedRunes); 


      filterRunewords(runewords, selectedRunes);
    });
  });
}


function filterRunewords(runewords, selectedRunes) {
  const container = document.getElementById('runewords-container');
  container.innerHTML = ''; 


  const runeCount = selectedRunes.reduce((acc, rune) => {
    acc[rune] = (acc[rune] || 0) + 1;
    return acc;
  }, {});


  const matchingRunewords = runewords.filter((runeword) => {
    return runeword.runes.every((rune) => {

      const requiredRuneCount = runeword.runes.filter(r => r === rune).length;
      return (runeCount[rune] || 0) >= requiredRuneCount;
    });
  });


  if (matchingRunewords.length === 0) {
    container.innerHTML = '<p>No matching runewords found.</p>';
    return;
  }

  matchingRunewords.forEach((runeword) => {
    const runewordDiv = document.createElement('div');
    runewordDiv.classList.add('runeword');

    runewordDiv.innerHTML = `
      <h3>${runeword.name}</h3>
      <p>Type: ${runeword.type}</p>
      <p>Sockets: ${runeword.sockets}</p>
      <p>Required Level: ${runeword.requiredLevel}</p>
      <p>Runes: ${runeword.runes.join(', ')}</p>
      <p>Effects: ${

        runeword.effects && runeword.effects.new
          ? runeword.effects.new.map((effect) => `<span>${effect}</span>`).join(', ')
          : 'No effects available'
      }</p>
    `;

    container.appendChild(runewordDiv);
  });
}



document.addEventListener('DOMContentLoaded', loadRunesAndRunewords);
