(function() {
  var SimpleLine, canvas, clear, colors, context, draw_circle, drawing, handle_mousedown, handle_mousemove, handle_mouseup, height, imgdata, line, lmin, ox, oy, ready, sx, sy, tmin, width, _ref, _ref2, _ref3,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  canvas = context = imgdata = null;

  _ref = [0, 0], width = _ref[0], height = _ref[1];

  _ref2 = [0, 0], ox = _ref2[0], oy = _ref2[1];

  _ref3 = [0, 0], sx = _ref3[0], sy = _ref3[1];

  line = null;

  tmin = 16;

  lmin = 20;

  drawing = false;

  colors = {
    node: "#576B9C",
    highlight: "#7893AD",
    disabled: "#E54D2E",
    line: "#2D2A52"
  };

  clear = function() {
    return canvas.width = canvas.width;
  };

  handle_mousedown = function(e) {
    var _ref4;
    _ref4 = [e.pageX - ox, e.pageY - oy], sx = _ref4[0], sy = _ref4[1];
    if ((0 <= sx && sx <= width) && (0 <= sy && sy <= height)) {
      drawing = true;
      imgdata = context.getImageData(0, 0, width, height);
      return line = new SimpleLine(sx, sy, Math.PI / tmin, lmin);
    }
  };

  handle_mouseup = function(e) {
    var points, x, y, _i, _len, _ref4, _ref5, _ref6, _ref7;
    if (drawing) {
      points = line.get_points();
      _ref4 = points[0], sx = _ref4[0], sy = _ref4[1];
      context.putImageData(imgdata, 0, 0);
      draw_circle(sx, sy, 2, colors.line);
      _ref5 = points.slice(1);
      for (_i = 0, _len = _ref5.length; _i < _len; _i++) {
        _ref6 = _ref5[_i], x = _ref6[0], y = _ref6[1];
        draw_circle(x, y, 2, colors.line);
        context.beginPath();
        context.moveTo(sx, sy);
        context.lineTo(x, y);
        context.strokeStyle = colors.line;
        context.lineWidth = 1;
        context.stroke();
        _ref7 = [x, y], sx = _ref7[0], sy = _ref7[1];
      }
    }
    return drawing = false;
  };

  handle_mousemove = function(e) {
    var mx, my, _ref4, _ref5;
    _ref4 = [e.pageX - ox, e.pageY - oy], mx = _ref4[0], my = _ref4[1];
    if (drawing) {
      if (mx > width || mx < 0 || my <= 0 || my > height) handle_mouseup();
      line.add_point(mx, my);
      draw_circle(mx, my, 2, colors.node);
      context.beginPath();
      context.moveTo(sx, sy);
      context.lineTo(mx, my);
      context.strokeStyle = colors.line;
      context.lineWidth = 1;
      context.stroke();
      return _ref5 = [mx, my], sx = _ref5[0], sy = _ref5[1], _ref5;
    }
  };

  draw_circle = function(x, y, rad, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, rad, 0, Math.PI * 2, true);
    context.closePath();
    return context.fill();
  };

  ready = function() {
    var el, offset, _ref4, _ref5;
    $('#clear-lines').click(clear);
    $('#asen').text(tmin);
    $('#slen').text(lmin);
    $('#theta').val(tmin).change(function() {
      tmin = $(this).val();
      return $('#asen').text(tmin);
    });
    $('#len').val(lmin).change(function() {
      lmin = $(this).val();
      return $('#slen').text(lmin);
    });
    el = $('#line-canvas');
    canvas = el[0];
    _ref4 = [canvas.width, canvas.height], width = _ref4[0], height = _ref4[1];
    context = canvas.getContext('2d');
    offset = el.offset();
    _ref5 = [offset.left, offset.top], ox = _ref5[0], oy = _ref5[1];
    el.mousedown(handle_mousedown).mouseup(handle_mouseup);
    return $(window).mousemove(handle_mousemove);
  };

  SimpleLine = (function() {

    function SimpleLine(sx, sy, tmin, lmin) {
      if (tmin == null) tmin = Math.PI / 5;
      if (lmin == null) lmin = 3;
      this.get_points = __bind(this.get_points, this);
      this.add_point = __bind(this.add_point, this);
      this.sx = sx;
      this.sy = sy;
      this.tmin = tmin;
      this.lmin = lmin;
      this.lx = null;
      this.ly = null;
      this.points = [[sx, sy]];
    }

    SimpleLine.prototype.add_point = function(x, y) {
      var n1len, n1x, n1y, n2len, n2x, n2y, theta;
      if (!(this.lx != null)) {
        this.lx = x;
        this.ly = y;
        return this.points.push([x, y]);
      } else {
        n2x = x - this.lx;
        n2y = y - this.ly;
        n2len = Math.sqrt(n2x * n2x + n2y * n2y);
        if (n2len < this.lmin) {
          this.points[this.points.length - 1] = [x, y];
          return;
        }
        n1x = this.lx - this.sx;
        n1y = this.ly - this.sy;
        n1len = Math.sqrt(n1x * n1x + n1y * n1y);
        theta = Math.acos((n1x * n2x + n1y * n2y) / (n1len * n2len));
        if (theta < this.tmin) {
          this.points[this.points.length - 1] = [x, y];
        } else {
          this.points.push([x, y]);
          this.sx = this.lx;
          this.sy = this.ly;
        }
        this.lx = x;
        return this.ly = y;
      }
    };

    SimpleLine.prototype.get_points = function() {
      return this.points;
    };

    return SimpleLine;

  })();

  $(document).ready(ready);

}).call(this);
