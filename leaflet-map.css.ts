import { css } from 'lit-element';

export default css`
  [hidden] {
    display: none !important;
  }

  :host {
    display: block;
    height: 480px;
  }

  #map {
    height: 100%;
    width: 100%;
    position: relative;
  }

  .leaflet-control-fullscreen-button span {
    display: flex;
    width: 30px;
    height: 30px;
    justify-content: center;
    align-items: center;
  }

  .leaflet-legend-contents {
    background-color: var(--leaflet-legend-contents-background, rgba(0,0,0,0.25));
  }

  .leaflet-legend-contents h3 {
    margin-top: 0;
  }

  .leaflet-legend-title {
    margin: 3px;
    padding-bottom: 5px;
  }

  .leaflet-legend-column {
    float: left;
    margin-left: 10px;
  }


  .leaflet-legend-item {
    display: table;
    margin: 2px 0;
  }

  .leaflet-legend-item span {
    vertical-align: middle;
    display: table-cell;
    word-break: keep-all;
    white-space: nowrap;
    background-color: transparent;
    text-align: left;
  }

  .leaflet-legend-item-clickable {
    cursor: pointer;
  }

  .leaflet-legend-item-inactive span {
    color: #cccccc;
  }

  .leaflet-legend-item-inactive i img, .leaflet-legend-item-inactive i canvas {
    opacity: 0.3;
  }

  .leaflet-legend-item i {
    display: inline-block;
    padding: 0px 3px 0px 4px;
    position: relative;
    vertical-align: middle;
  }

  .leaflet-legend-toggle {
    background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTk5MDE0Mjk2NTEwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE3Nzk4IiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwvc3R5bGU+PC9kZWZzPjxwYXRoIGQ9Ik05MzQuNCA0NzguNzJINzM3LjI4Yy0xNS44NzItMTEwLjA4LTExMS4xMDQtMTk0LjU2LTIyNS4yOC0xOTQuNTZTMzAyLjU5MiAzNjguNjQgMjg2LjcyIDQ3OC43Mkg4OS42djY2LjU2SDI4Ni43MmMxNS44NzIgMTEwLjA4IDExMS4xMDQgMTk0LjU2IDIyNS4yOCAxOTQuNTZzMjA5LjQwOC04NC40OCAyMjUuMjgtMTk0LjU2aDE5Ny4xMnYtNjYuNTZ6IiBmaWxsPSIjNzA3MDcwIiBwLWlkPSIxNzc5OSI+PC9wYXRoPjwvc3ZnPg==");
    background-repeat: no-repeat;
    background-position: 50% 50%;
    box-shadow: none;
    border-radius: 4px;
  }

  .leaflet-legend-contents {
    display: none;
  }

  .leaflet-legend-expanded .leaflet-legend-contents {
    display: block;
    padding: 6px 15px 6px 6px;
  }

  .leaflet-legend-contents img {
    position: absolute;
  }

  .leaflet-legend-contents:after {
    content: "";
    display: block;
    clear: both;
  }
`;
