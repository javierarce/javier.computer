const onLoad = () => {
  new Chameleon(["twitter", "gmail", "wikipedia", "tumblr"]);

  window.lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy",
  });
};

window.onload = onLoad;
