---
title: 前端CSS typography技巧
date: 2025-07-31T15:47:44+08:00
tags:
---
记录一些看blog时发现的前端CSS技巧，主要针对的是文字排版。


# SVG Filter


{% raw %}

<div id="example1">

 <svg class=hidden xmlns=http://www.w3.org/2000/svg>
            <filter id=x height=500%>
                <feTurbulence baseFrequency="0.01 0.02" numOctaves=2 result=t0></feTurbulence>
                <feDisplacementMap in=SourceGraphic in2=t0 result=d0 scale=4></feDisplacementMap>
                <feComposite in=SourceGraphic in2=d0 operator=atop result=0></feComposite>
                <feTurbulence baseFrequency=1 numOctaves=2 result=t1></feTurbulence>
                <feDisplacementMap in=0 in2=t1 result=d1 scale=1></feDisplacementMap>
                <feComposite in=0 in2=d1 operator=atop result=1></feComposite>
                <feOffset dx=-3 dy=-3 in=1/>
            </filter>
        </svg>
        <svg class=hidden xmlns=http://www.w3.org/2000/svg>
            <filter id=xs>
                <feTurbulence baseFrequency="0.01 0.02" numOctaves=2 result=t0></feTurbulence>
                <feDisplacementMap in=SourceGraphic in2=t0 result=d0 scale=4></feDisplacementMap>
                <feComposite in=SourceGraphic in2=d0 operator=atop result=0></feComposite>
                <feTurbulence baseFrequency=1 numOctaves=2 result=t1></feTurbulence>
                <feDisplacementMap in=0 in2=t1 result=d1 scale=1></feDisplacementMap>
                <feComposite in=0 in2=d1 operator=atop result=1></feComposite>
                <feOffset dx=-3 dy=-3 in=1/>
            </filter>
        </svg>

<style>
    .xerox, h2 {
        filter: url(#x);
    }

<h1 class="xerox">Why your website should be under 14kB in size</h1>

<h2 id="what-is-tcp-slow-start">What is TCP slow start?<a class="anchor">&nbsp;#</a></h2>


</div>
{% endraw %}