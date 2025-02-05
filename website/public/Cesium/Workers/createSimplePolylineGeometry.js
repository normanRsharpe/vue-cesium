define([
  './when-4bbc8319',
  './Matrix2-9aa31791',
  './ArcType-98ec98bf',
  './Transforms-d13cc04e',
  './Color-1ab5c5c7',
  './ComponentDatatype-93750d1a',
  './RuntimeError-346a3079',
  './GeometryAttribute-43536dc0',
  './GeometryAttributes-7827a6c2',
  './IndexDatatype-b7d979a6',
  './PolylinePipeline-64021a2e',
  './combine-83860057',
  './WebGLConstants-1c8239cc',
  './EllipsoidGeodesic-dd8f2afb',
  './EllipsoidRhumbLine-30c47ff4',
  './IntersectionTests-96a04219',
  './Plane-318d6937'
], function (e, o, r, t, a, l, i, n, s, p, d, c, y, f, u, h, C) {
  'use strict'
  function T(e, o, r, t, l, i, n) {
    var s,
      p = d.PolylinePipeline.numberOfPoints(e, o, l),
      c = r.red,
      y = r.green,
      f = r.blue,
      u = r.alpha,
      h = t.red,
      C = t.green,
      T = t.blue,
      g = t.alpha
    if (a.Color.equals(r, t)) {
      for (s = 0; s < p; s++)
        (i[n++] = a.Color.floatToByte(c)), (i[n++] = a.Color.floatToByte(y)), (i[n++] = a.Color.floatToByte(f)), (i[n++] = a.Color.floatToByte(u))
      return n
    }
    var m = (h - c) / p,
      v = (C - y) / p,
      P = (T - f) / p,
      _ = (g - u) / p,
      b = n
    for (s = 0; s < p; s++)
      (i[b++] = a.Color.floatToByte(c + s * m)),
        (i[b++] = a.Color.floatToByte(y + s * v)),
        (i[b++] = a.Color.floatToByte(f + s * P)),
        (i[b++] = a.Color.floatToByte(u + s * _))
    return b
  }
  function g(t) {
    var i = (t = e.defaultValue(t, e.defaultValue.EMPTY_OBJECT)).positions,
      n = t.colors,
      s = e.defaultValue(t.colorsPerVertex, !1)
    ;(this._positions = i),
      (this._colors = n),
      (this._colorsPerVertex = s),
      (this._arcType = e.defaultValue(t.arcType, r.ArcType.GEODESIC)),
      (this._granularity = e.defaultValue(t.granularity, l.CesiumMath.RADIANS_PER_DEGREE)),
      (this._ellipsoid = e.defaultValue(t.ellipsoid, o.Ellipsoid.WGS84)),
      (this._workerName = 'createSimplePolylineGeometry')
    var p = 1 + i.length * o.Cartesian3.packedLength
    ;(p += e.defined(n) ? 1 + n.length * a.Color.packedLength : 1), (this.packedLength = p + o.Ellipsoid.packedLength + 3)
  }
  ;(g.pack = function (r, t, l) {
    var i
    l = e.defaultValue(l, 0)
    var n = r._positions,
      s = n.length
    for (t[l++] = s, i = 0; i < s; ++i, l += o.Cartesian3.packedLength) o.Cartesian3.pack(n[i], t, l)
    var p = r._colors
    for (s = e.defined(p) ? p.length : 0, t[l++] = s, i = 0; i < s; ++i, l += a.Color.packedLength) a.Color.pack(p[i], t, l)
    return (
      o.Ellipsoid.pack(r._ellipsoid, t, l),
      (l += o.Ellipsoid.packedLength),
      (t[l++] = r._colorsPerVertex ? 1 : 0),
      (t[l++] = r._arcType),
      (t[l] = r._granularity),
      t
    )
  }),
    (g.unpack = function (r, t, l) {
      var i
      t = e.defaultValue(t, 0)
      var n = r[t++],
        s = new Array(n)
      for (i = 0; i < n; ++i, t += o.Cartesian3.packedLength) s[i] = o.Cartesian3.unpack(r, t)
      var p = (n = r[t++]) > 0 ? new Array(n) : void 0
      for (i = 0; i < n; ++i, t += a.Color.packedLength) p[i] = a.Color.unpack(r, t)
      var d = o.Ellipsoid.unpack(r, t)
      t += o.Ellipsoid.packedLength
      var c = 1 === r[t++],
        y = r[t++],
        f = r[t]
      return e.defined(l)
        ? ((l._positions = s), (l._colors = p), (l._ellipsoid = d), (l._colorsPerVertex = c), (l._arcType = y), (l._granularity = f), l)
        : new g({ positions: s, colors: p, ellipsoid: d, colorsPerVertex: c, arcType: y, granularity: f })
    })
  var m = new Array(2),
    v = new Array(2),
    P = { positions: m, height: v, ellipsoid: void 0, minDistance: void 0, granularity: void 0 }
  return (
    (g.createGeometry = function (i) {
      var c,
        y,
        f,
        u,
        h,
        C = i._positions,
        g = i._colors,
        _ = i._colorsPerVertex,
        b = i._arcType,
        B = i._granularity,
        A = i._ellipsoid,
        E = l.CesiumMath.chordLength(B, A.maximumRadius),
        k = e.defined(g) && !_,
        G = C.length,
        w = 0
      if (b === r.ArcType.GEODESIC || b === r.ArcType.RHUMB) {
        var D, L, V
        b === r.ArcType.GEODESIC
          ? ((D = l.CesiumMath.chordLength(B, A.maximumRadius)), (L = d.PolylinePipeline.numberOfPoints), (V = d.PolylinePipeline.generateArc))
          : ((D = B), (L = d.PolylinePipeline.numberOfPointsRhumbLine), (V = d.PolylinePipeline.generateRhumbArc))
        var x = d.PolylinePipeline.extractHeights(C, A),
          S = P
        if ((b === r.ArcType.GEODESIC ? (S.minDistance = E) : (S.granularity = B), (S.ellipsoid = A), k)) {
          var I = 0
          for (c = 0; c < G - 1; c++) I += L(C[c], C[c + 1], D) + 1
          ;(y = new Float64Array(3 * I)), (u = new Uint8Array(4 * I)), (S.positions = m), (S.height = v)
          var R = 0
          for (c = 0; c < G - 1; ++c) {
            ;(m[0] = C[c]), (m[1] = C[c + 1]), (v[0] = x[c]), (v[1] = x[c + 1])
            var O = V(S)
            if (e.defined(g)) {
              var M = O.length / 3
              h = g[c]
              for (var U = 0; U < M; ++U)
                (u[R++] = a.Color.floatToByte(h.red)),
                  (u[R++] = a.Color.floatToByte(h.green)),
                  (u[R++] = a.Color.floatToByte(h.blue)),
                  (u[R++] = a.Color.floatToByte(h.alpha))
            }
            y.set(O, w), (w += O.length)
          }
        } else if (((S.positions = C), (S.height = x), (y = new Float64Array(V(S))), e.defined(g))) {
          for (u = new Uint8Array((y.length / 3) * 4), c = 0; c < G - 1; ++c) {
            w = T(C[c], C[c + 1], g[c], g[c + 1], E, u, w)
          }
          var N = g[G - 1]
          ;(u[w++] = a.Color.floatToByte(N.red)),
            (u[w++] = a.Color.floatToByte(N.green)),
            (u[w++] = a.Color.floatToByte(N.blue)),
            (u[w++] = a.Color.floatToByte(N.alpha))
        }
      } else {
        ;(f = k ? 2 * G - 2 : G), (y = new Float64Array(3 * f)), (u = e.defined(g) ? new Uint8Array(4 * f) : void 0)
        var F = 0,
          H = 0
        for (c = 0; c < G; ++c) {
          var W = C[c]
          if (
            (k &&
              c > 0 &&
              (o.Cartesian3.pack(W, y, F),
              (F += 3),
              (h = g[c - 1]),
              (u[H++] = a.Color.floatToByte(h.red)),
              (u[H++] = a.Color.floatToByte(h.green)),
              (u[H++] = a.Color.floatToByte(h.blue)),
              (u[H++] = a.Color.floatToByte(h.alpha))),
            k && c === G - 1)
          )
            break
          o.Cartesian3.pack(W, y, F),
            (F += 3),
            e.defined(g) &&
              ((h = g[c]),
              (u[H++] = a.Color.floatToByte(h.red)),
              (u[H++] = a.Color.floatToByte(h.green)),
              (u[H++] = a.Color.floatToByte(h.blue)),
              (u[H++] = a.Color.floatToByte(h.alpha)))
        }
      }
      var Y = new s.GeometryAttributes()
      ;(Y.position = new n.GeometryAttribute({ componentDatatype: l.ComponentDatatype.DOUBLE, componentsPerAttribute: 3, values: y })),
        e.defined(g) &&
          (Y.color = new n.GeometryAttribute({
            componentDatatype: l.ComponentDatatype.UNSIGNED_BYTE,
            componentsPerAttribute: 4,
            values: u,
            normalize: !0
          }))
      var q = 2 * ((f = y.length / 3) - 1),
        z = p.IndexDatatype.createTypedArray(f, q),
        J = 0
      for (c = 0; c < f - 1; ++c) (z[J++] = c), (z[J++] = c + 1)
      return new n.Geometry({ attributes: Y, indices: z, primitiveType: n.PrimitiveType.LINES, boundingSphere: t.BoundingSphere.fromPoints(C) })
    }),
    function (r, t) {
      return e.defined(t) && (r = g.unpack(r, t)), (r._ellipsoid = o.Ellipsoid.clone(r._ellipsoid)), g.createGeometry(r)
    }
  )
})
