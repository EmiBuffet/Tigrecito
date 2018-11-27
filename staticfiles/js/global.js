"use strict";

/* Clickable rows */
$(document).ready(function() {
  $(".clickable-row").click(function() {
    window.location = `${HOST}/${$(this).data("path")}`
  })
});

/* Enable tooltips everywhere */
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
