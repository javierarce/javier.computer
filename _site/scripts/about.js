const onLoad = () => {
  new Chameleon(["twitter", "gmail", "wikipedia", "tumblr"]);
  window.lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy",
  });

  const updateTimePhrase = () => {
    const updateElement = document.querySelector("[data-update-timestamp]");
    if (!updateElement) return;

    const updateTimestamp =
      parseInt(updateElement.dataset.updateTimestamp) * 1000;
    const now = new Date();
    const updateDate = new Date(updateTimestamp);
    const diffMs = now - updateDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const timeElement = document.getElementById("time-phrase");

    if (timeElement && diffDays >= 0 && diffDays < 30) {
      let timeText = "";

      if (diffDays === 0) {
        timeText = "today";
      } else if (diffDays === 1) {
        timeText = "yesterday";
      } else if (diffDays < 7) {
        timeText = `${diffDays} days ago`;
      } else {
        const currentYear = now.getFullYear();
        const updateYear = updateDate.getFullYear();

        if (currentYear === updateYear) {
          const options = { month: "long", day: "numeric" };
          timeText = "on " + updateDate.toLocaleDateString("en-US", options);
        } else {
          const options = { year: "numeric", month: "long", day: "numeric" };
          timeText = "on " + updateDate.toLocaleDateString("en-US", options);
        }
      }

      timeElement.textContent = timeText;
    }
  };

  updateTimePhrase();
};

window.onload = onLoad;
