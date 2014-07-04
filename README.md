nhnb-leaflet-map
================

[Leaflet](http://leafletjs.com/reference.html) is a modern open-source JavaScript library for **mobile-friendly interactive maps**.

nhnb-leaflet-map makes Leaflet available as web-component: &lt;nhnb-leaflet-map&gt; &lt;/nhnb-leaflet-map&gt;
Please have a look at the [demo page](https://github.io/nhnb-leaflet-map/demo.html).
 

Web-components are an emerging standard which is based on Custom Elements, Shadow DOM, HTML Imports and Web Animations.
[Polymer](http://www.polymer-project.org/docs/start/tutorial/intro.html) is a library which simplifies working with web-components. It includes a compatibility layer for browsers which
do not yet support web-components natively, yet.


Status
======

nhnb-leaflet-map is a prove of concept. It already supports the most important features of leaflet. 

At this time the following custom elements are defined:

* nhnb-leaflet-map (L.map)
* nhnb-leaflet-marker (L.marker)
* nhnb-leaflet-icon
* nhnb-leaflet-tilelayer (L.tileLayer)

Most of the options documented in the [Leaflet reference](http://leafletjs.com/reference.html) for those objects are exported as html attributes. 
For example use &lt;nhnb-leaflet-map latitude="51.505" longitude="-0.09" zoom="13"&gt; &lt;/nhnb-leaflet-map&gt; to define the view and zoom level.

Dependencies
============

nhnb-leaflet-map depends on Polymer in ../platform and ../polymer and it expects an installation of leaflet in ../leaflet-bower.


Notes for implementing child elements
=====================================

Child elements like markers or layers will be initialized by the surrounding map by setting a "map" javascript property.
Therefore the child element should define a mapChanged method and use that as initializer. 
Don't forget to define a detached method to support removal of elements. The nhnb-leaflet-marker element is a good template.  

License
=======

Copyright (c) 2014, Hendrik Brummermann
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are
permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice, this list of
      conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright notice, this list
      of conditions and the following disclaimer in the documentation and/or other materials
      provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
