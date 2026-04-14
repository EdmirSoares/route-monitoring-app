import { useRef, useEffect, useCallback } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { WebView } from "react-native-webview";

type LatLng = { latitude: number; longitude: number };

type LeafletMapProps = {
  location?: LatLng | null;
  route?: LatLng[];
  style?: ViewStyle;
};

const DEFAULT_CENTER: LatLng = { latitude: -23.55052, longitude: -46.633308 };

function buildHtml(center: LatLng): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; background: #c8d6c3; }
    #map { width: 100%; height: 100%; }
    .leaflet-control-attribution { display: none; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', { zoomControl: false });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    map.setView([${center.latitude}, ${center.longitude}], 15);

    var marker = L.circleMarker([${center.latitude}, ${center.longitude}], {
      radius: 10,
      color: '#ff5300',
      fillColor: '#ff5300',
      fillOpacity: 1,
      weight: 3
    }).addTo(map);

    var accuracyCircle = null;

    var routeLine = L.polyline([], {
      color: '#ff5300',
      weight: 3,
      opacity: 0.85,
      lineJoin: 'round',
      lineCap: 'round'
    }).addTo(map);

    function handleMessage(data) {
      try {
        var msg = JSON.parse(data);

        if (msg.type === 'updateLocation') {
          var ll = [msg.lat, msg.lng];
          marker.setLatLng(ll);
          map.setView(ll, 15, { animate: true });
          if (msg.accuracy) {
            if (accuracyCircle) {
              accuracyCircle.setLatLng(ll).setRadius(msg.accuracy);
            } else {
              accuracyCircle = L.circle(ll, {
                radius: msg.accuracy,
                color: '#ff5300',
                fillColor: '#ff5300',
                fillOpacity: 0.08,
                weight: 1
              }).addTo(map);
            }
          }
        }

        if (msg.type === 'updateRoute') {
          var latlngs = msg.points.map(function(p) { return [p[0], p[1]]; });
          routeLine.setLatLngs(latlngs);
          if (latlngs.length > 1) {
            map.fitBounds(routeLine.getBounds(), { padding: [40, 40], maxZoom: 17, animate: true });
          }
        }
      } catch(err) {}
    }

    window.addEventListener('message', function(e) { handleMessage(e.data); });
    document.addEventListener('message', function(e) { handleMessage(e.data); });
  </script>
</body>
</html>
`;
}

export function LeafletMap({ location, route, style }: LeafletMapProps) {
  const webViewRef = useRef<WebView>(null);
  const center = location ?? DEFAULT_CENTER;
  const htmlRef = useRef(buildHtml(center));
  const readyRef = useRef(false);
  const pendingRouteRef = useRef<LatLng[] | null>(null);

  const sendRoute = useCallback((pts: LatLng[]) => {
    if (!webViewRef.current || !readyRef.current) return;
    const points = pts.map((p) => [p.latitude, p.longitude]);
    const js = `
      window.dispatchEvent(new MessageEvent('message', {
        data: JSON.stringify({ type: 'updateRoute', points: ${JSON.stringify(points)} })
      }));
      true;
    `;
    webViewRef.current.injectJavaScript(js);
  }, []);

  useEffect(() => {
    if (!location || !webViewRef.current || !readyRef.current) return;
    const js = `
      window.dispatchEvent(new MessageEvent('message', {
        data: JSON.stringify({
          type: 'updateLocation',
          lat: ${location.latitude},
          lng: ${location.longitude},
          accuracy: ${null}
        })
      }));
      true;
    `;
    webViewRef.current.injectJavaScript(js);
  }, [location?.latitude, location?.longitude]);

  useEffect(() => {
    if (!route) return;
    if (!readyRef.current) {
      pendingRouteRef.current = route;
      return;
    }
    sendRoute(route);
  }, [route, sendRoute]);

  const handleLoad = useCallback(() => {
    readyRef.current = true;
    const pending = pendingRouteRef.current;
    if (pending && pending.length > 0) {
      sendRoute(pending);
      pendingRouteRef.current = null;
    }
  }, [sendRoute]);

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlRef.current }}
        style={styles.webview}
        scrollEnabled={false}
        javaScriptEnabled
        domStorageEnabled
        originWhitelist={["*"]}
        mixedContentMode="always"
        allowFileAccess
        allowUniversalAccessFromFileURLs
        onLoad={handleLoad}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  webview: {
    flex: 1,
    backgroundColor: "transparent",
  },
});
