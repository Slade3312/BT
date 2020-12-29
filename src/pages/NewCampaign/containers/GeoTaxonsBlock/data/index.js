export const zoomControlsString = id => `
  <style>
  .ymaps_zoom-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .ymaps_button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 20px;
    color: #787878;
    border: none;
    border-radius: 2px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.26);
    background-color: #ffdc7d;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .ymaps_button:hover {
    background-color: #ffba00;
  }

  .ymaps_button:active {
    box-shadow: inset 0 1px 2px 0 rgba(0, 0, 0, 0.26);
  }

  .ymaps_button__out {
    margin-top: 5px;
  }
  </style>

  <div class="ymaps_zoom-container">
    <button id='zoom-in-${id}' class='ymaps_button'>
      <svg viewBox="0 0 10 10" width="10" height="10">
        <rect width="10" height="2" fill="currentColor" y="4" rx="1" />
        <rect width="2" height="10" fill="currentColor" x="4" ry="1" />
      </svg>
    </button>

    <button id='zoom-out-${id}' class='ymaps_button ymaps_button__out'>
      <svg viewBox="0 0 10 10" width="10" height="10">
        <rect width="10" height="2" fill="currentColor" y="4" rx="1" />
      </svg>
    </button>
  </div>
`;
