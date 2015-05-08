var MapComponent = React.createClass({displayName: "MapComponent",

	componentDidMount: function() {

		var lat    = parseFloat( city.loc.lat );
		var lng    = parseFloat( city.loc.lng );

		var map    = this.map = L.map('map-canvas', {
			center  : [ lat, lng ],
			minZoom : 2,
			zoom    : 13
		});

		// pake Tiles-nya Default OSM
		/*L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a>'
		}).addTo( map );*/

		// pake Tiles-nya MapQuest
		/*L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright" title="OpenStreetMap" target="_blank">OpenStreetMap</a>',
			subdomains: ['otile1', 'otile2', 'otile3', 'otile4']
		}).addTo( map );*/

		// pake Tiles-nya CartoDB
		L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
			attribution : '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
		}).addTo( map );

		// bikin costum marker
		L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';
		var culinary = L.AwesomeMarkers.icon({
			icon: 'cutlery',
			markerColor: 'orange'
		});
		var attraction = L.AwesomeMarkers.icon({
			icon: 'child',
			markerColor: '#1266E4'
		});
		var museum = L.AwesomeMarkers.icon({
			icon: 'institution',
			markerColor: '#4A1F1F'
		});

		// bikin markernya
		places.map( function( place, index ) {

			var div = document.createElement( 'div' );
			div.ref = place.id;

			setInterval( function() {
        if( div )
          clearInterval();
      }, 2);

      React.render(
				React.createElement(Popup, {
					key:  place.id, 
					place:  place, 
					addList:  this.props.addList, 
					unList:  this.props.unList}),
				div
			);

			var icon;
			switch( place.category ) {
				case 'Culinary':
					icon = culinary;
					break;
				case 'Attraction':
					icon = attraction;
					break;
				case 'Museum':
					icon = museum;
					break;
				default:
					icon = museum;
					break;
			}

			L.marker( [ parseFloat(place.loc.lat), parseFloat(place.loc.lng) ], { icon : icon } )
				.addTo( this.map )
				.bindPopup( div );

		}, this);

	},

	render: function() {
		return (
			React.createElement("div", {id: "map-canvas", ref: "map", className: "open"})
		);
	}
});

var Popup = React.createClass({displayName: "Popup",

	getInitialState: function() {
		return {
			selected: false 
		};
	},

	handleClick: function( e ) {

		// pas di buat nambah
		if( ! this.state.selected )
			this.props.addList( this );
		else // buat nge-delete
			this.props.unList( this );
	},

	render: function() {

		var place       = this.props.place;
		var btnWantGo   = React.createElement("button", {type: "button", 
												className:  "btn btn-sm btn-block btn-primary", 
												onClick:  this.handleClick}, 
													React.createElement("span", {className: "fa fa-heart-o"}), " I wanna go here"
											);
		var btnCancelGo = React.createElement("button", {type: "button", 
												className:  "btn btn-sm btn-block btn-danger", 
												onClick:  this.handleClick}, 
													React.createElement("span", {className: "fa fa-trash-o"}), " Cancel"
											);

		var btn         = ( ! this.state.selected ) ? btnWantGo : btnCancelGo;

		return (
			React.createElement("div", {className: "place-popup", ref:  place.id}, 
				React.createElement("h3", null,  place.name), 
				React.createElement("div", {className: "image-container"}, 
					React.createElement("img", {src: "/images/Batu.jpg", className: "img img-responsive"})
				), 
				React.createElement("p", null, "Category: ",  place.category), 
				React.createElement("ul", {className: "list-inline"}, 
					React.createElement("li", null, 
						React.createElement("button", {type: "button", className: "btn btn-sm btn-block btn-default"}, "I have been here")
					), 
					React.createElement("li", null,  btn )
				)
			)
		);
	}
});