(function($) {
  $.fn.chronos = function(repeat) {
    function processElement($element, options) {
      repeat = repeat || true;

      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      var relativeTime = moment.utc(options.date + " " + options.time, "YYYY-MM-DD HH:mm");

      if (options.recurring && relativeTime < moment().utc()) {
        var parts = options.recurring.split(".");
        relativeTime = relativeTime.add(parts[0], parts[1]);
      }

      var previews = options.timezones.split("|").map(function(tz) {
        var dateTime = moment
                          .utc(options.date + " " + options.time, "YYYY-MM-DD HH:mm")
                          .tz(tz)
                          .format(options.format);

        return dateTime.replace("TZ", tz);
      });

      relativeTime = relativeTime.tz(moment.tz.guess()).format(options.format);

      $element
        .text(relativeTime.replace("TZ", moment.tz.guess())).addClass("cooked")
        .attr("title", previews.join("\n"));

      if (repeat) {
        this.timeout = setTimeout(function() {
          processElement($element, options);
        }, 10000);
      }
    }

    return this.each(function() {
      var $this = $(this);

      var options = {};
      options.format = $this.attr("data-format");
      options.date = $this.attr("data-date");
      options.time = $this.attr("data-time");
      options.recurring = $this.attr("data-recurring");
      options.timezones = $this.attr("data-timezones");

      processElement($this, options);
    });
  };
})(jQuery);
