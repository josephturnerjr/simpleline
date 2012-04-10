# Canvas elements
canvas = context = imgdata = null
# Canvas size
[width, height] = [0, 0]
# Screen offsets for canvas element
[ox, oy] = [0, 0]
# Starting positions
[sx, sy] = [0, 0]
# SimpleLine variable
line = null
tmin = 16
lmin = 20
# State machine
drawing = false
# Fancy!
colors = {node: "#576B9C", highlight: "#7893AD", disabled: "#E54D2E", line: "#2D2A52"}

clear = ->
    canvas.width = canvas.width

handle_mousedown = (e) ->
    [sx, sy] = [e.pageX - ox, e.pageY - oy]
    # Only start lines inside of the canvas
    if 0 <= sx <= width and 0 <= sy <= height 
        drawing = true
        # Save the canvas image data to redraw with simplified line
        imgdata = context.getImageData(0, 0, width, height)
        line = new SimpleLine(sx, sy, Math.PI / tmin, lmin)

handle_mouseup = (e) ->
    if drawing
        points = line.get_points()
        [sx, sy] = points[0]
        # Clear the context, then redraw
        context.putImageData(imgdata, 0, 0)
        draw_circle sx, sy, 2, colors.line
        for [x, y] in points[1..]
            draw_circle x, y, 2, colors.line
            context.beginPath()
            context.moveTo sx, sy
            context.lineTo x, y 
            context.strokeStyle = colors.line
            context.lineWidth = 1
            context.stroke()
            [sx, sy] = [x, y]
    drawing = false

handle_mousemove = (e) ->
    [mx, my] = [e.pageX - ox, e.pageY - oy]
    if drawing
        if mx > width or mx < 0 or my <= 0 or my > height 
            handle_mouseup()
        line.add_point(mx, my)
        draw_circle mx, my, 2, colors.node
        context.beginPath()
        context.moveTo sx, sy
        context.lineTo mx, my 
        context.strokeStyle = colors.line
        context.lineWidth = 1
        context.stroke()
        [sx, sy] = [mx, my]

draw_circle = (x, y, rad, color) ->
    context.fillStyle = color
    context.beginPath()
    context.arc(x, y, rad, 0, Math.PI*2, true)
    context.closePath()
    context.fill()

ready = () ->
    $('#clear-lines').click(clear)
    $('#asen').text(tmin)
    $('#slen').text(lmin)
    $('#theta').val(tmin).change(() -> 
        tmin = $(this).val()
        $('#asen').text(tmin))
    $('#len').val(lmin).change(() -> 
        lmin = $(this).val()
        $('#slen').text(lmin))
    el = $('#line-canvas')
    canvas = el[0]
    [width, height] = [canvas.width, canvas.height]
    context = canvas.getContext('2d')
    offset = el.offset()
    [ox, oy] = [offset.left, offset.top]
    el.mousedown(handle_mousedown).mouseup(handle_mouseup)
    $(window).mousemove(handle_mousemove)

class SimpleLine
    constructor: (sx, sy, tmin=Math.PI / 5, lmin=3) ->
        @sx = sx
        @sy = sy
        @tmin = tmin
        @lmin = lmin
        @lx = null
        @ly = null
        @points = [[sx, sy]]

    add_point: (x, y) =>
        if not @lx?
            @lx = x
            @ly = y
            @points.push([x, y])
        else
            n2x = x - @lx
            n2y = y - @ly
            n2len = Math.sqrt(n2x * n2x + n2y * n2y)
            if n2len < @lmin
                @points[@points.length - 1] = [x, y]
                return 
            n1x = @lx - @sx
            n1y = @ly - @sy
            n1len = Math.sqrt(n1x * n1x + n1y * n1y)
            theta = Math.acos((n1x * n2x + n1y * n2y) / (n1len * n2len))
            if theta < @tmin
                @points[@points.length - 1] = [x, y]
            else
                @points.push([x, y])
                @sx = @lx
                @sy = @ly
            @lx = x
            @ly = y

    get_points: =>
        return @points

$(document).ready(ready)
