define([
  './Matrix2-9aa31791',
  './AxisAlignedBoundingBox-07c6b7f2',
  './Transforms-d13cc04e',
  './when-4bbc8319',
  './RuntimeError-346a3079',
  './TerrainEncoding-ba779f11',
  './ComponentDatatype-93750d1a',
  './OrientedBoundingBox-4b932f63',
  './WebMercatorProjection-58801a11',
  './createTaskProcessorWorker',
  './combine-83860057',
  './AttributeCompression-af389d04',
  './WebGLConstants-1c8239cc',
  './EllipsoidTangentPlane-eecce7e8',
  './IntersectionTests-96a04219',
  './Plane-318d6937'
], function (e, t, a, i, r, n, s, l, o, f, u, c, d, h, m, g) {
  'use strict'
  var p = Object.freeze({ NONE: 0, LERC: 1 }),
    x = {}
  x.DEFAULT_STRUCTURE = Object.freeze({ heightScale: 1, heightOffset: 0, elementsPerHeight: 1, stride: 1, elementMultiplier: 256, isBigEndian: !1 })
  var w = new e.Cartesian3(),
    k = new e.Matrix4(),
    y = new e.Cartesian3(),
    I = new e.Cartesian3()
  x.computeVertices = function (r) {
    var f,
      u,
      c,
      d,
      h = Math.cos,
      m = Math.sin,
      g = Math.sqrt,
      p = Math.atan,
      v = Math.exp,
      b = s.CesiumMath.PI_OVER_TWO,
      U = s.CesiumMath.toRadians,
      T = r.heightmap,
      M = r.width,
      V = r.height,
      A = r.skirtHeight,
      B = A > 0,
      D = i.defaultValue(r.isGeographic, !0),
      S = i.defaultValue(r.ellipsoid, e.Ellipsoid.WGS84),
      P = 1 / S.maximumRadius,
      E = e.Rectangle.clone(r.nativeRectangle),
      C = e.Rectangle.clone(r.rectangle)
    i.defined(C)
      ? ((f = C.west), (u = C.south), (c = C.east), (d = C.north))
      : D
      ? ((f = U(E.west)), (u = U(E.south)), (c = U(E.east)), (d = U(E.north)))
      : ((f = E.west * P), (u = b - 2 * p(v(-E.south * P))), (c = E.east * P), (d = b - 2 * p(v(-E.north * P))))
    var F = r.relativeToCenter,
      N = i.defined(F)
    F = N ? F : e.Cartesian3.ZERO
    var O = i.defaultValue(r.includeWebMercatorT, !1),
      R = i.defaultValue(r.exaggeration, 1),
      L = i.defaultValue(r.exaggerationRelativeHeight, 0),
      z = 1 !== R,
      H = i.defaultValue(r.structure, x.DEFAULT_STRUCTURE),
      _ = i.defaultValue(H.heightScale, x.DEFAULT_STRUCTURE.heightScale),
      Y = i.defaultValue(H.heightOffset, x.DEFAULT_STRUCTURE.heightOffset),
      W = i.defaultValue(H.elementsPerHeight, x.DEFAULT_STRUCTURE.elementsPerHeight),
      X = i.defaultValue(H.stride, x.DEFAULT_STRUCTURE.stride),
      Z = i.defaultValue(H.elementMultiplier, x.DEFAULT_STRUCTURE.elementMultiplier),
      j = i.defaultValue(H.isBigEndian, x.DEFAULT_STRUCTURE.isBigEndian),
      G = e.Rectangle.computeWidth(E),
      q = e.Rectangle.computeHeight(E),
      Q = G / (M - 1),
      J = q / (V - 1)
    D || ((G *= P), (q *= P))
    var K,
      $,
      ee = S.radiiSquared,
      te = ee.x,
      ae = ee.y,
      ie = ee.z,
      re = 65536,
      ne = -65536,
      se = a.Transforms.eastNorthUpToFixedFrame(F, S),
      le = e.Matrix4.inverseTransformation(se, k)
    O &&
      ((K = o.WebMercatorProjection.geodeticLatitudeToMercatorAngle(u)), ($ = 1 / (o.WebMercatorProjection.geodeticLatitudeToMercatorAngle(d) - K)))
    var oe = y
    ;(oe.x = Number.POSITIVE_INFINITY), (oe.y = Number.POSITIVE_INFINITY), (oe.z = Number.POSITIVE_INFINITY)
    var fe = I
    ;(fe.x = Number.NEGATIVE_INFINITY), (fe.y = Number.NEGATIVE_INFINITY), (fe.z = Number.NEGATIVE_INFINITY)
    var ue = Number.POSITIVE_INFINITY,
      ce = M * V,
      de = ce + (A > 0 ? 2 * M + 2 * V : 0),
      he = new Array(de),
      me = new Array(de),
      ge = new Array(de),
      pe = O ? new Array(de) : [],
      xe = z ? new Array(de) : [],
      we = 0,
      ke = V,
      ye = 0,
      Ie = M
    B && (--we, ++ke, --ye, ++Ie)
    for (var ve = 1e-5, be = we; be < ke; ++be) {
      var Ue = be
      Ue < 0 && (Ue = 0), Ue >= V && (Ue = V - 1)
      var Te = E.north - J * Ue,
        Me = ((Te = D ? U(Te) : b - 2 * p(v(-Te * P))) - u) / (d - u)
      Me = s.CesiumMath.clamp(Me, 0, 1)
      var Ve = be === we,
        Ae = be === ke - 1
      A > 0 && (Ve ? (Te += ve * q) : Ae && (Te -= ve * q))
      var Be,
        De = h(Te),
        Se = m(Te),
        Pe = ie * Se
      O && (Be = (o.WebMercatorProjection.geodeticLatitudeToMercatorAngle(Te) - K) * $)
      for (var Ee = ye; Ee < Ie; ++Ee) {
        var Ce = Ee
        Ce < 0 && (Ce = 0), Ce >= M && (Ce = M - 1)
        var Fe,
          Ne,
          Oe = Ue * (M * X) + Ce * X
        if (1 === W) Fe = T[Oe]
        else if (((Fe = 0), j)) for (Ne = 0; Ne < W; ++Ne) Fe = Fe * Z + T[Oe + Ne]
        else for (Ne = W - 1; Ne >= 0; --Ne) Fe = Fe * Z + T[Oe + Ne]
        ;(Fe = Fe * _ + Y), (ne = Math.max(ne, Fe)), (re = Math.min(re, Fe))
        var Re = E.west + Q * Ce
        D ? (Re = U(Re)) : (Re *= P)
        var Le = (Re - f) / (c - f)
        Le = s.CesiumMath.clamp(Le, 0, 1)
        var ze = Ue * M + Ce
        if (A > 0) {
          var He = Ee === ye,
            _e = Ee === Ie - 1,
            Ye = Ve || Ae || He || _e
          if ((Ve || Ae) && (He || _e)) continue
          Ye &&
            ((Fe -= A),
            He
              ? ((ze = ce + (V - Ue - 1)), (Re -= ve * G))
              : Ae
              ? (ze = ce + V + (M - Ce - 1))
              : _e
              ? ((ze = ce + V + M + Ue), (Re += ve * G))
              : Ve && (ze = ce + V + M + V + Ce))
        }
        var We = De * h(Re),
          Xe = De * m(Re),
          Ze = te * We,
          je = ae * Xe,
          Ge = 1 / g(Ze * We + je * Xe + Pe * Se),
          qe = Ze * Ge,
          Qe = je * Ge,
          Je = Pe * Ge,
          Ke = new e.Cartesian3()
        ;(Ke.x = qe + We * Fe),
          (Ke.y = Qe + Xe * Fe),
          (Ke.z = Je + Se * Fe),
          e.Matrix4.multiplyByPoint(le, Ke, w),
          e.Cartesian3.minimumByComponent(w, oe, oe),
          e.Cartesian3.maximumByComponent(w, fe, fe),
          (ue = Math.min(ue, Fe)),
          (he[ze] = Ke),
          (ge[ze] = new e.Cartesian2(Le, Me)),
          (me[ze] = Fe),
          O && (pe[ze] = Be),
          z && (xe[ze] = S.geodeticSurfaceNormal(Ke))
      }
    }
    var $e,
      et,
      tt = a.BoundingSphere.fromPoints(he)
    ;(i.defined(C) && ($e = l.OrientedBoundingBox.fromRectangle(C, re, ne, S)), N) &&
      (et = new n.EllipsoidalOccluder(S).computeHorizonCullingPointPossiblyUnderEllipsoid(F, he, re))
    for (
      var at = new t.AxisAlignedBoundingBox(oe, fe, F),
        it = new n.TerrainEncoding(F, at, ue, ne, se, !1, O, z, R, L),
        rt = new Float32Array(de * it.stride),
        nt = 0,
        st = 0;
      st < de;
      ++st
    )
      nt = it.encode(rt, nt, he[st], ge[st], me[st], void 0, pe[st], xe[st])
    return {
      vertices: rt,
      maximumHeight: ne,
      minimumHeight: re,
      encoding: it,
      boundingSphere3D: tt,
      orientedBoundingBox: $e,
      occludeePointInScaledSpace: et
    }
  }
  var v = i.createCommonjsModule(function (e) {
    /* Copyright 2015-2018 Esri. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 @preserve */
    !(function () {
      var t,
        a,
        i,
        r,
        n,
        s,
        l,
        o,
        f,
        u,
        c,
        d,
        h,
        m,
        g,
        p,
        x =
          ((t = {
            defaultNoDataValue: -34027999387901484e22,
            decode: function (e, s) {
              var l = (s = s || {}).encodedMaskData || null === s.encodedMaskData,
                o = n(e, s.inputOffset || 0, l),
                f = null !== s.noDataValue ? s.noDataValue : t.defaultNoDataValue,
                u = a(o, s.pixelType || Float32Array, s.encodedMaskData, f, s.returnMask),
                c = { width: o.width, height: o.height, pixelData: u.resultPixels, minValue: u.minValue, maxValue: o.pixels.maxValue, noDataValue: f }
              return (
                u.resultMask && (c.maskData = u.resultMask),
                s.returnEncodedMask && o.mask && (c.encodedMaskData = o.mask.bitset ? o.mask.bitset : null),
                s.returnFileInfo && ((c.fileInfo = i(o)), s.computeUsedBitDepths && (c.fileInfo.bitDepths = r(o))),
                c
              )
            }
          }),
          (a = function (e, t, a, i, r) {
            var n,
              l,
              o,
              f = 0,
              u = e.pixels.numBlocksX,
              c = e.pixels.numBlocksY,
              d = Math.floor(e.width / u),
              h = Math.floor(e.height / c),
              m = 2 * e.maxZError,
              g = Number.MAX_VALUE
            ;(a = a || (e.mask ? e.mask.bitset : null)), (l = new t(e.width * e.height)), r && a && (o = new Uint8Array(e.width * e.height))
            for (var p, x, w = new Float32Array(d * h), k = 0; k <= c; k++) {
              var y = k !== c ? h : e.height % c
              if (0 !== y)
                for (var I = 0; I <= u; I++) {
                  var v = I !== u ? d : e.width % u
                  if (0 !== v) {
                    var b,
                      U,
                      T,
                      M,
                      V = k * e.width * h + I * d,
                      A = e.width - v,
                      B = e.pixels.blocks[f]
                    if (
                      (B.encoding < 2
                        ? (0 === B.encoding
                            ? (b = B.rawData)
                            : (s(B.stuffedData, B.bitsPerPixel, B.numValidPixels, B.offset, m, w, e.pixels.maxValue), (b = w)),
                          (U = 0))
                        : (T = 2 === B.encoding ? 0 : B.offset),
                      a)
                    )
                      for (x = 0; x < y; x++) {
                        for (7 & V && ((M = a[V >> 3]), (M <<= 7 & V)), p = 0; p < v; p++)
                          7 & V || (M = a[V >> 3]),
                            128 & M
                              ? (o && (o[V] = 1), (g = g > (n = B.encoding < 2 ? b[U++] : T) ? n : g), (l[V++] = n))
                              : (o && (o[V] = 0), (l[V++] = i)),
                            (M <<= 1)
                        V += A
                      }
                    else if (B.encoding < 2)
                      for (x = 0; x < y; x++) {
                        for (p = 0; p < v; p++) (g = g > (n = b[U++]) ? n : g), (l[V++] = n)
                        V += A
                      }
                    else
                      for (g = g > T ? T : g, x = 0; x < y; x++) {
                        for (p = 0; p < v; p++) l[V++] = T
                        V += A
                      }
                    if (1 === B.encoding && U !== B.numValidPixels) throw 'Block and Mask do not match'
                    f++
                  }
                }
            }
            return { resultPixels: l, resultMask: o, minValue: g }
          }),
          (i = function (e) {
            return {
              fileIdentifierString: e.fileIdentifierString,
              fileVersion: e.fileVersion,
              imageType: e.imageType,
              height: e.height,
              width: e.width,
              maxZError: e.maxZError,
              eofOffset: e.eofOffset,
              mask: e.mask
                ? { numBlocksX: e.mask.numBlocksX, numBlocksY: e.mask.numBlocksY, numBytes: e.mask.numBytes, maxValue: e.mask.maxValue }
                : null,
              pixels: {
                numBlocksX: e.pixels.numBlocksX,
                numBlocksY: e.pixels.numBlocksY,
                numBytes: e.pixels.numBytes,
                maxValue: e.pixels.maxValue,
                noDataValue: e.noDataValue
              }
            }
          }),
          (r = function (e) {
            for (var t = e.pixels.numBlocksX * e.pixels.numBlocksY, a = {}, i = 0; i < t; i++) {
              var r = e.pixels.blocks[i]
              0 === r.encoding ? (a.float32 = !0) : 1 === r.encoding ? (a[r.bitsPerPixel] = !0) : (a[0] = !0)
            }
            return Object.keys(a)
          }),
          (n = function (e, t, a) {
            var i = {},
              r = new Uint8Array(e, t, 10)
            if (((i.fileIdentifierString = String.fromCharCode.apply(null, r)), 'CntZImage' !== i.fileIdentifierString.trim()))
              throw 'Unexpected file identifier string: ' + i.fileIdentifierString
            t += 10
            var n = new DataView(e, t, 24)
            if (
              ((i.fileVersion = n.getInt32(0, !0)),
              (i.imageType = n.getInt32(4, !0)),
              (i.height = n.getUint32(8, !0)),
              (i.width = n.getUint32(12, !0)),
              (i.maxZError = n.getFloat64(16, !0)),
              (t += 24),
              !a)
            )
              if (
                ((n = new DataView(e, t, 16)),
                (i.mask = {}),
                (i.mask.numBlocksY = n.getUint32(0, !0)),
                (i.mask.numBlocksX = n.getUint32(4, !0)),
                (i.mask.numBytes = n.getUint32(8, !0)),
                (i.mask.maxValue = n.getFloat32(12, !0)),
                (t += 16),
                i.mask.numBytes > 0)
              ) {
                var s = new Uint8Array(Math.ceil((i.width * i.height) / 8)),
                  l = (n = new DataView(e, t, i.mask.numBytes)).getInt16(0, !0),
                  o = 2,
                  f = 0
                do {
                  if (l > 0) for (; l--; ) s[f++] = n.getUint8(o++)
                  else {
                    var u = n.getUint8(o++)
                    for (l = -l; l--; ) s[f++] = u
                  }
                  ;(l = n.getInt16(o, !0)), (o += 2)
                } while (o < i.mask.numBytes)
                if (-32768 !== l || f < s.length) throw 'Unexpected end of mask RLE encoding'
                ;(i.mask.bitset = s), (t += i.mask.numBytes)
              } else
                0 == (i.mask.numBytes | i.mask.numBlocksY | i.mask.maxValue) && (i.mask.bitset = new Uint8Array(Math.ceil((i.width * i.height) / 8)))
            ;(n = new DataView(e, t, 16)),
              (i.pixels = {}),
              (i.pixels.numBlocksY = n.getUint32(0, !0)),
              (i.pixels.numBlocksX = n.getUint32(4, !0)),
              (i.pixels.numBytes = n.getUint32(8, !0)),
              (i.pixels.maxValue = n.getFloat32(12, !0)),
              (t += 16)
            var c = i.pixels.numBlocksX,
              d = i.pixels.numBlocksY,
              h = c + (i.width % c > 0 ? 1 : 0),
              m = d + (i.height % d > 0 ? 1 : 0)
            i.pixels.blocks = new Array(h * m)
            for (var g = 0, p = 0; p < m; p++)
              for (var x = 0; x < h; x++) {
                var w = 0,
                  k = e.byteLength - t
                n = new DataView(e, t, Math.min(10, k))
                var y = {}
                i.pixels.blocks[g++] = y
                var I = n.getUint8(0)
                if ((w++, (y.encoding = 63 & I), y.encoding > 3)) throw 'Invalid block encoding (' + y.encoding + ')'
                if (2 !== y.encoding) {
                  if (0 !== I && 2 !== I) {
                    if (((I >>= 6), (y.offsetType = I), 2 === I)) (y.offset = n.getInt8(1)), w++
                    else if (1 === I) (y.offset = n.getInt16(1, !0)), (w += 2)
                    else {
                      if (0 !== I) throw 'Invalid block offset type'
                      ;(y.offset = n.getFloat32(1, !0)), (w += 4)
                    }
                    if (1 === y.encoding)
                      if (((I = n.getUint8(w)), w++, (y.bitsPerPixel = 63 & I), (I >>= 6), (y.numValidPixelsType = I), 2 === I))
                        (y.numValidPixels = n.getUint8(w)), w++
                      else if (1 === I) (y.numValidPixels = n.getUint16(w, !0)), (w += 2)
                      else {
                        if (0 !== I) throw 'Invalid valid pixel count type'
                        ;(y.numValidPixels = n.getUint32(w, !0)), (w += 4)
                      }
                  }
                  var v
                  if (((t += w), 3 !== y.encoding))
                    if (0 === y.encoding) {
                      var b = (i.pixels.numBytes - 1) / 4
                      if (b !== Math.floor(b)) throw 'uncompressed block has invalid length'
                      ;(v = new ArrayBuffer(4 * b)), new Uint8Array(v).set(new Uint8Array(e, t, 4 * b))
                      var U = new Float32Array(v)
                      ;(y.rawData = U), (t += 4 * b)
                    } else if (1 === y.encoding) {
                      var T = Math.ceil((y.numValidPixels * y.bitsPerPixel) / 8),
                        M = Math.ceil(T / 4)
                      ;(v = new ArrayBuffer(4 * M)), new Uint8Array(v).set(new Uint8Array(e, t, T)), (y.stuffedData = new Uint32Array(v)), (t += T)
                    }
                } else t++
              }
            return (i.eofOffset = t), i
          }),
          (s = function (e, t, a, i, r, n, s) {
            var l,
              o,
              f,
              u = (1 << t) - 1,
              c = 0,
              d = 0,
              h = Math.ceil((s - i) / r),
              m = 4 * e.length - Math.ceil((t * a) / 8)
            for (e[e.length - 1] <<= 8 * m, l = 0; l < a; l++) {
              if ((0 === d && ((f = e[c++]), (d = 32)), d >= t)) (o = (f >>> (d - t)) & u), (d -= t)
              else {
                var g = t - d
                ;(o = ((f & u) << g) & u), (o += (f = e[c++]) >>> (d = 32 - g))
              }
              n[l] = o < h ? i + o * r : s
            }
            return n
          }),
          t),
        w =
          ((l = function (e, t, a, i, r, n, s, l) {
            var o,
              f,
              u,
              c,
              d,
              h = (1 << a) - 1,
              m = 0,
              g = 0,
              p = 4 * e.length - Math.ceil((a * i) / 8)
            if (((e[e.length - 1] <<= 8 * p), r))
              for (o = 0; o < i; o++)
                0 === g && ((u = e[m++]), (g = 32)),
                  g >= a ? ((f = (u >>> (g - a)) & h), (g -= a)) : ((f = ((u & h) << (c = a - g)) & h), (f += (u = e[m++]) >>> (g = 32 - c))),
                  (t[o] = r[f])
            else
              for (d = Math.ceil((l - n) / s), o = 0; o < i; o++)
                0 === g && ((u = e[m++]), (g = 32)),
                  g >= a ? ((f = (u >>> (g - a)) & h), (g -= a)) : ((f = ((u & h) << (c = a - g)) & h), (f += (u = e[m++]) >>> (g = 32 - c))),
                  (t[o] = f < d ? n + f * s : l)
          }),
          (o = function (e, t, a, i, r, n) {
            var s,
              l = (1 << t) - 1,
              o = 0,
              f = 0,
              u = 0,
              c = 0,
              d = 0,
              h = [],
              m = 4 * e.length - Math.ceil((t * a) / 8)
            e[e.length - 1] <<= 8 * m
            var g = Math.ceil((n - i) / r)
            for (f = 0; f < a; f++)
              0 === c && ((s = e[o++]), (c = 32)),
                c >= t ? ((d = (s >>> (c - t)) & l), (c -= t)) : ((d = ((s & l) << (u = t - c)) & l), (d += (s = e[o++]) >>> (c = 32 - u))),
                (h[f] = d < g ? i + d * r : n)
            return h.unshift(i), h
          }),
          (f = function (e, t, a, i, r, n, s, l) {
            var o,
              f,
              u,
              c,
              d = (1 << a) - 1,
              h = 0,
              m = 0,
              g = 0
            if (r)
              for (o = 0; o < i; o++)
                0 === m && ((u = e[h++]), (m = 32), (g = 0)),
                  m >= a
                    ? ((f = (u >>> g) & d), (m -= a), (g += a))
                    : ((f = (u >>> g) & d), (m = 32 - (c = a - m)), (f |= ((u = e[h++]) & ((1 << c) - 1)) << (a - c)), (g = c)),
                  (t[o] = r[f])
            else {
              var p = Math.ceil((l - n) / s)
              for (o = 0; o < i; o++)
                0 === m && ((u = e[h++]), (m = 32), (g = 0)),
                  m >= a
                    ? ((f = (u >>> g) & d), (m -= a), (g += a))
                    : ((f = (u >>> g) & d), (m = 32 - (c = a - m)), (f |= ((u = e[h++]) & ((1 << c) - 1)) << (a - c)), (g = c)),
                  (t[o] = f < p ? n + f * s : l)
            }
            return t
          }),
          (u = function (e, t, a, i, r, n) {
            var s,
              l = (1 << t) - 1,
              o = 0,
              f = 0,
              u = 0,
              c = 0,
              d = 0,
              h = 0,
              m = [],
              g = Math.ceil((n - i) / r)
            for (f = 0; f < a; f++)
              0 === c && ((s = e[o++]), (c = 32), (h = 0)),
                c >= t
                  ? ((d = (s >>> h) & l), (c -= t), (h += t))
                  : ((d = (s >>> h) & l), (c = 32 - (u = t - c)), (d |= ((s = e[o++]) & ((1 << u) - 1)) << (t - u)), (h = u)),
                (m[f] = d < g ? i + d * r : n)
            return m.unshift(i), m
          }),
          (c = function (e, t, a, i) {
            var r,
              n,
              s,
              l,
              o = (1 << a) - 1,
              f = 0,
              u = 0,
              c = 4 * e.length - Math.ceil((a * i) / 8)
            for (e[e.length - 1] <<= 8 * c, r = 0; r < i; r++)
              0 === u && ((s = e[f++]), (u = 32)),
                u >= a ? ((n = (s >>> (u - a)) & o), (u -= a)) : ((n = ((s & o) << (l = a - u)) & o), (n += (s = e[f++]) >>> (u = 32 - l))),
                (t[r] = n)
            return t
          }),
          (d = function (e, t, a, i) {
            var r,
              n,
              s,
              l,
              o = (1 << a) - 1,
              f = 0,
              u = 0,
              c = 0
            for (r = 0; r < i; r++)
              0 === u && ((s = e[f++]), (u = 32), (c = 0)),
                u >= a
                  ? ((n = (s >>> c) & o), (u -= a), (c += a))
                  : ((n = (s >>> c) & o), (u = 32 - (l = a - u)), (n |= ((s = e[f++]) & ((1 << l) - 1)) << (a - l)), (c = l)),
                (t[r] = n)
            return t
          }),
          (h = {
            HUFFMAN_LUT_BITS_MAX: 12,
            computeChecksumFletcher32: function (e) {
              for (var t = 65535, a = 65535, i = e.length, r = Math.floor(i / 2), n = 0; r; ) {
                var s = r >= 359 ? 359 : r
                r -= s
                do {
                  ;(t += e[n++] << 8), (a += t += e[n++])
                } while (--s)
                ;(t = (65535 & t) + (t >>> 16)), (a = (65535 & a) + (a >>> 16))
              }
              return 1 & i && (a += t += e[n] << 8), (((a = (65535 & a) + (a >>> 16)) << 16) | (t = (65535 & t) + (t >>> 16))) >>> 0
            },
            readHeaderInfo: function (e, t) {
              var a = t.ptr,
                i = new Uint8Array(e, a, 6),
                r = {}
              if (((r.fileIdentifierString = String.fromCharCode.apply(null, i)), 0 !== r.fileIdentifierString.lastIndexOf('Lerc2', 0)))
                throw 'Unexpected file identifier string (expect Lerc2 ): ' + r.fileIdentifierString
              a += 6
              var n,
                s = new DataView(e, a, 8),
                l = s.getInt32(0, !0)
              if (
                ((r.fileVersion = l),
                (a += 4),
                l >= 3 && ((r.checksum = s.getUint32(4, !0)), (a += 4)),
                (s = new DataView(e, a, 12)),
                (r.height = s.getUint32(0, !0)),
                (r.width = s.getUint32(4, !0)),
                (a += 8),
                l >= 4 ? ((r.numDims = s.getUint32(8, !0)), (a += 4)) : (r.numDims = 1),
                (s = new DataView(e, a, 40)),
                (r.numValidPixel = s.getUint32(0, !0)),
                (r.microBlockSize = s.getInt32(4, !0)),
                (r.blobSize = s.getInt32(8, !0)),
                (r.imageType = s.getInt32(12, !0)),
                (r.maxZError = s.getFloat64(16, !0)),
                (r.zMin = s.getFloat64(24, !0)),
                (r.zMax = s.getFloat64(32, !0)),
                (a += 40),
                (t.headerInfo = r),
                (t.ptr = a),
                l >= 3 && ((n = l >= 4 ? 52 : 48), this.computeChecksumFletcher32(new Uint8Array(e, a - n, r.blobSize - 14)) !== r.checksum))
              )
                throw 'Checksum failed.'
              return !0
            },
            checkMinMaxRanges: function (e, t) {
              var a = t.headerInfo,
                i = this.getDataTypeArray(a.imageType),
                r = a.numDims * this.getDataTypeSize(a.imageType),
                n = this.readSubArray(e, t.ptr, i, r),
                s = this.readSubArray(e, t.ptr + r, i, r)
              t.ptr += 2 * r
              var l,
                o = !0
              for (l = 0; l < a.numDims; l++)
                if (n[l] !== s[l]) {
                  o = !1
                  break
                }
              return (a.minValues = n), (a.maxValues = s), o
            },
            readSubArray: function (e, t, a, i) {
              var r
              if (a === Uint8Array) r = new Uint8Array(e, t, i)
              else {
                var n = new ArrayBuffer(i)
                new Uint8Array(n).set(new Uint8Array(e, t, i)), (r = new a(n))
              }
              return r
            },
            readMask: function (e, t) {
              var a,
                i,
                r = t.ptr,
                n = t.headerInfo,
                s = n.width * n.height,
                l = n.numValidPixel,
                o = new DataView(e, r, 4),
                f = {}
              if (((f.numBytes = o.getUint32(0, !0)), (r += 4), (0 === l || s === l) && 0 !== f.numBytes)) throw 'invalid mask'
              if (0 === l)
                (a = new Uint8Array(Math.ceil(s / 8))), (f.bitset = a), (i = new Uint8Array(s)), (t.pixels.resultMask = i), (r += f.numBytes)
              else if (f.numBytes > 0) {
                a = new Uint8Array(Math.ceil(s / 8))
                var u = (o = new DataView(e, r, f.numBytes)).getInt16(0, !0),
                  c = 2,
                  d = 0,
                  h = 0
                do {
                  if (u > 0) for (; u--; ) a[d++] = o.getUint8(c++)
                  else for (h = o.getUint8(c++), u = -u; u--; ) a[d++] = h
                  ;(u = o.getInt16(c, !0)), (c += 2)
                } while (c < f.numBytes)
                if (-32768 !== u || d < a.length) throw 'Unexpected end of mask RLE encoding'
                i = new Uint8Array(s)
                var m = 0,
                  g = 0
                for (g = 0; g < s; g++) 7 & g ? ((m = a[g >> 3]), (m <<= 7 & g)) : (m = a[g >> 3]), 128 & m && (i[g] = 1)
                ;(t.pixels.resultMask = i), (f.bitset = a), (r += f.numBytes)
              }
              return (t.ptr = r), (t.mask = f), !0
            },
            readDataOneSweep: function (e, t, a) {
              var i,
                r = t.ptr,
                n = t.headerInfo,
                s = n.numDims,
                l = n.width * n.height,
                o = n.imageType,
                f = n.numValidPixel * h.getDataTypeSize(o) * s,
                u = t.pixels.resultMask
              if (a === Uint8Array) i = new Uint8Array(e, r, f)
              else {
                var c = new ArrayBuffer(f)
                new Uint8Array(c).set(new Uint8Array(e, r, f)), (i = new a(c))
              }
              if (i.length === l * s) t.pixels.resultPixels = i
              else {
                t.pixels.resultPixels = new a(l * s)
                var d = 0,
                  m = 0,
                  g = 0,
                  p = 0
                if (s > 1) for (g = 0; g < s; g++) for (p = g * l, m = 0; m < l; m++) u[m] && (t.pixels.resultPixels[p + m] = i[d++])
                else for (m = 0; m < l; m++) u[m] && (t.pixels.resultPixels[m] = i[d++])
              }
              return (r += f), (t.ptr = r), !0
            },
            readHuffmanTree: function (e, t) {
              var a = this.HUFFMAN_LUT_BITS_MAX,
                i = new DataView(e, t.ptr, 16)
              if (((t.ptr += 16), i.getInt32(0, !0) < 2)) throw 'unsupported Huffman version'
              var r = i.getInt32(4, !0),
                n = i.getInt32(8, !0),
                s = i.getInt32(12, !0)
              if (n >= s) return !1
              var l = new Uint32Array(s - n)
              h.decodeBits(e, t, l)
              var o,
                f,
                u,
                c,
                d = []
              for (o = n; o < s; o++) d[(f = o - (o < r ? 0 : r))] = { first: l[o - n], second: null }
              var g = e.byteLength - t.ptr,
                p = Math.ceil(g / 4),
                x = new ArrayBuffer(4 * p)
              new Uint8Array(x).set(new Uint8Array(e, t.ptr, g))
              var w,
                k = new Uint32Array(x),
                y = 0,
                I = 0
              for (w = k[0], o = n; o < s; o++)
                (c = d[(f = o - (o < r ? 0 : r))].first) > 0 &&
                  ((d[f].second = (w << y) >>> (32 - c)),
                  32 - y >= c ? 32 === (y += c) && ((y = 0), (w = k[++I])) : ((y += c - 32), (w = k[++I]), (d[f].second |= w >>> (32 - y))))
              var v = 0,
                b = 0,
                U = new m()
              for (o = 0; o < d.length; o++) void 0 !== d[o] && (v = Math.max(v, d[o].first))
              ;(b = v >= a ? a : v), v >= 30 && console.log('WARning, large NUM LUT BITS IS ' + v)
              var T,
                M,
                V,
                A,
                B,
                D = []
              for (o = n; o < s; o++)
                if ((c = d[(f = o - (o < r ? 0 : r))].first) > 0)
                  if (((T = [c, f]), c <= b)) for (M = d[f].second << (b - c), V = 1 << (b - c), u = 0; u < V; u++) D[M | u] = T
                  else
                    for (M = d[f].second, B = U, A = c - 1; A >= 0; A--)
                      (M >>> A) & 1 ? (B.right || (B.right = new m()), (B = B.right)) : (B.left || (B.left = new m()), (B = B.left)),
                        0 !== A || B.val || (B.val = T[1])
              return { decodeLut: D, numBitsLUTQick: b, numBitsLUT: v, tree: U, stuffedData: k, srcPtr: I, bitPos: y }
            },
            readHuffman: function (e, t, a) {
              var i,
                r,
                n,
                s,
                l,
                o,
                f,
                u,
                c,
                d = t.headerInfo,
                h = d.numDims,
                m = t.headerInfo.height,
                g = t.headerInfo.width,
                p = g * m,
                x = this.readHuffmanTree(e, t),
                w = x.decodeLut,
                k = x.tree,
                y = x.stuffedData,
                I = x.srcPtr,
                v = x.bitPos,
                b = x.numBitsLUTQick,
                U = x.numBitsLUT,
                T = 0 === t.headerInfo.imageType ? 128 : 0,
                M = t.pixels.resultMask,
                V = 0
              v > 0 && (I++, (v = 0))
              var A,
                B = y[I],
                D = 1 === t.encodeMode,
                S = new a(p * h),
                P = S
              for (A = 0; A < d.numDims; A++) {
                if ((h > 1 && ((P = new a(S.buffer, p * A, p)), (V = 0)), t.headerInfo.numValidPixel === g * m))
                  for (u = 0, o = 0; o < m; o++)
                    for (f = 0; f < g; f++, u++) {
                      if (((r = 0), (l = s = (B << v) >>> (32 - b)), 32 - v < b && (l = s |= y[I + 1] >>> (64 - v - b)), w[l]))
                        (r = w[l][1]), (v += w[l][0])
                      else
                        for (l = s = (B << v) >>> (32 - U), 32 - v < U && (l = s |= y[I + 1] >>> (64 - v - U)), i = k, c = 0; c < U; c++)
                          if (!(i = (s >>> (U - c - 1)) & 1 ? i.right : i.left).left && !i.right) {
                            ;(r = i.val), (v = v + c + 1)
                            break
                          }
                      v >= 32 && ((v -= 32), (B = y[++I])),
                        (n = r - T),
                        D ? ((n += f > 0 ? V : o > 0 ? P[u - g] : V), (n &= 255), (P[u] = n), (V = n)) : (P[u] = n)
                    }
                else
                  for (u = 0, o = 0; o < m; o++)
                    for (f = 0; f < g; f++, u++)
                      if (M[u]) {
                        if (((r = 0), (l = s = (B << v) >>> (32 - b)), 32 - v < b && (l = s |= y[I + 1] >>> (64 - v - b)), w[l]))
                          (r = w[l][1]), (v += w[l][0])
                        else
                          for (l = s = (B << v) >>> (32 - U), 32 - v < U && (l = s |= y[I + 1] >>> (64 - v - U)), i = k, c = 0; c < U; c++)
                            if (!(i = (s >>> (U - c - 1)) & 1 ? i.right : i.left).left && !i.right) {
                              ;(r = i.val), (v = v + c + 1)
                              break
                            }
                        v >= 32 && ((v -= 32), (B = y[++I])),
                          (n = r - T),
                          D
                            ? (f > 0 && M[u - 1] ? (n += V) : o > 0 && M[u - g] ? (n += P[u - g]) : (n += V), (n &= 255), (P[u] = n), (V = n))
                            : (P[u] = n)
                      }
                t.ptr = t.ptr + 4 * (I + 1) + (v > 0 ? 4 : 0)
              }
              t.pixels.resultPixels = S
            },
            decodeBits: function (e, t, a, i, r) {
              var n = t.headerInfo,
                s = n.fileVersion,
                h = 0,
                m = new DataView(e, t.ptr, 5),
                g = m.getUint8(0)
              h++
              var p = g >> 6,
                x = 0 === p ? 4 : 3 - p,
                w = (32 & g) > 0,
                k = 31 & g,
                y = 0
              if (1 === x) (y = m.getUint8(h)), h++
              else if (2 === x) (y = m.getUint16(h, !0)), (h += 2)
              else {
                if (4 !== x) throw 'Invalid valid pixel count type'
                ;(y = m.getUint32(h, !0)), (h += 4)
              }
              var I,
                v,
                b,
                U,
                T,
                M,
                V,
                A,
                B,
                D = 2 * n.maxZError,
                S = n.numDims > 1 ? n.maxValues[r] : n.zMax
              if (w) {
                for (
                  t.counter.lut++,
                    A = m.getUint8(h),
                    h++,
                    U = Math.ceil(((A - 1) * k) / 8),
                    T = Math.ceil(U / 4),
                    v = new ArrayBuffer(4 * T),
                    b = new Uint8Array(v),
                    t.ptr += h,
                    b.set(new Uint8Array(e, t.ptr, U)),
                    V = new Uint32Array(v),
                    t.ptr += U,
                    B = 0;
                  (A - 1) >>> B;

                )
                  B++
                ;(U = Math.ceil((y * B) / 8)),
                  (T = Math.ceil(U / 4)),
                  (v = new ArrayBuffer(4 * T)),
                  (b = new Uint8Array(v)).set(new Uint8Array(e, t.ptr, U)),
                  (I = new Uint32Array(v)),
                  (t.ptr += U),
                  (M = s >= 3 ? u(V, k, A - 1, i, D, S) : o(V, k, A - 1, i, D, S)),
                  s >= 3 ? f(I, a, B, y, M) : l(I, a, B, y, M)
              } else
                t.counter.bitstuffer++,
                  (B = k),
                  (t.ptr += h),
                  B > 0 &&
                    ((U = Math.ceil((y * B) / 8)),
                    (T = Math.ceil(U / 4)),
                    (v = new ArrayBuffer(4 * T)),
                    (b = new Uint8Array(v)).set(new Uint8Array(e, t.ptr, U)),
                    (I = new Uint32Array(v)),
                    (t.ptr += U),
                    s >= 3 ? (null == i ? d(I, a, B, y) : f(I, a, B, y, !1, i, D, S)) : null == i ? c(I, a, B, y) : l(I, a, B, y, !1, i, D, S))
            },
            readTiles: function (e, t, a) {
              var i = t.headerInfo,
                r = i.width,
                n = i.height,
                s = i.microBlockSize,
                l = i.imageType,
                o = h.getDataTypeSize(l),
                f = Math.ceil(r / s),
                u = Math.ceil(n / s)
              ;(t.pixels.numBlocksY = u), (t.pixels.numBlocksX = f), (t.pixels.ptr = 0)
              var c,
                d,
                m,
                g,
                p,
                x,
                w,
                k,
                y = 0,
                I = 0,
                v = 0,
                b = 0,
                U = 0,
                T = 0,
                M = 0,
                V = 0,
                A = 0,
                B = 0,
                D = 0,
                S = 0,
                P = 0,
                E = 0,
                C = 0,
                F = new a(s * s),
                N = n % s || s,
                O = r % s || s,
                R = i.numDims,
                L = t.pixels.resultMask,
                z = t.pixels.resultPixels
              for (v = 0; v < u; v++)
                for (U = v !== u - 1 ? s : N, b = 0; b < f; b++)
                  for (B = v * r * s + b * s, D = r - (T = b !== f - 1 ? s : O), k = 0; k < R; k++) {
                    if (
                      (R > 1 && (z = new a(t.pixels.resultPixels.buffer, r * n * k * o, r * n)),
                      (M = e.byteLength - t.ptr),
                      (d = {}),
                      (C = 0),
                      C++,
                      (A = ((V = (c = new DataView(e, t.ptr, Math.min(10, M))).getUint8(0)) >> 6) & 255),
                      ((V >> 2) & 15) != (((b * s) >> 3) & 15))
                    )
                      throw 'integrity issue'
                    if ((p = 3 & V) > 3) throw ((t.ptr += C), 'Invalid block encoding (' + p + ')')
                    if (2 !== p)
                      if (0 === p) {
                        if (
                          (t.counter.uncompressed++,
                          (t.ptr += C),
                          (S = (S = U * T * o) < (P = e.byteLength - t.ptr) ? S : P),
                          (m = new ArrayBuffer(S % o == 0 ? S : S + o - (S % o))),
                          new Uint8Array(m).set(new Uint8Array(e, t.ptr, S)),
                          (g = new a(m)),
                          (E = 0),
                          L)
                        )
                          for (y = 0; y < U; y++) {
                            for (I = 0; I < T; I++) L[B] && (z[B] = g[E++]), B++
                            B += D
                          }
                        else
                          for (y = 0; y < U; y++) {
                            for (I = 0; I < T; I++) z[B++] = g[E++]
                            B += D
                          }
                        t.ptr += E * o
                      } else if (((x = h.getDataTypeUsed(l, A)), (w = h.getOnePixel(d, C, x, c)), (C += h.getDataTypeSize(x)), 3 === p))
                        if (((t.ptr += C), t.counter.constantoffset++, L))
                          for (y = 0; y < U; y++) {
                            for (I = 0; I < T; I++) L[B] && (z[B] = w), B++
                            B += D
                          }
                        else
                          for (y = 0; y < U; y++) {
                            for (I = 0; I < T; I++) z[B++] = w
                            B += D
                          }
                      else if (((t.ptr += C), h.decodeBits(e, t, F, w, k), (C = 0), L))
                        for (y = 0; y < U; y++) {
                          for (I = 0; I < T; I++) L[B] && (z[B] = F[C++]), B++
                          B += D
                        }
                      else
                        for (y = 0; y < U; y++) {
                          for (I = 0; I < T; I++) z[B++] = F[C++]
                          B += D
                        }
                    else t.counter.constant++, (t.ptr += C)
                  }
            },
            formatFileInfo: function (e) {
              return {
                fileIdentifierString: e.headerInfo.fileIdentifierString,
                fileVersion: e.headerInfo.fileVersion,
                imageType: e.headerInfo.imageType,
                height: e.headerInfo.height,
                width: e.headerInfo.width,
                numValidPixel: e.headerInfo.numValidPixel,
                microBlockSize: e.headerInfo.microBlockSize,
                blobSize: e.headerInfo.blobSize,
                maxZError: e.headerInfo.maxZError,
                pixelType: h.getPixelType(e.headerInfo.imageType),
                eofOffset: e.eofOffset,
                mask: e.mask ? { numBytes: e.mask.numBytes } : null,
                pixels: {
                  numBlocksX: e.pixels.numBlocksX,
                  numBlocksY: e.pixels.numBlocksY,
                  maxValue: e.headerInfo.zMax,
                  minValue: e.headerInfo.zMin,
                  noDataValue: e.noDataValue
                }
              }
            },
            constructConstantSurface: function (e) {
              var t = e.headerInfo.zMax,
                a = e.headerInfo.numDims,
                i = e.headerInfo.height * e.headerInfo.width,
                r = i * a,
                n = 0,
                s = 0,
                l = 0,
                o = e.pixels.resultMask
              if (o)
                if (a > 1) for (n = 0; n < a; n++) for (l = n * i, s = 0; s < i; s++) o[s] && (e.pixels.resultPixels[l + s] = t)
                else for (s = 0; s < i; s++) o[s] && (e.pixels.resultPixels[s] = t)
              else if (e.pixels.resultPixels.fill) e.pixels.resultPixels.fill(t)
              else for (s = 0; s < r; s++) e.pixels.resultPixels[s] = t
            },
            getDataTypeArray: function (e) {
              var t
              switch (e) {
                case 0:
                  t = Int8Array
                  break
                case 1:
                  t = Uint8Array
                  break
                case 2:
                  t = Int16Array
                  break
                case 3:
                  t = Uint16Array
                  break
                case 4:
                  t = Int32Array
                  break
                case 5:
                  t = Uint32Array
                  break
                case 6:
                default:
                  t = Float32Array
                  break
                case 7:
                  t = Float64Array
              }
              return t
            },
            getPixelType: function (e) {
              var t
              switch (e) {
                case 0:
                  t = 'S8'
                  break
                case 1:
                  t = 'U8'
                  break
                case 2:
                  t = 'S16'
                  break
                case 3:
                  t = 'U16'
                  break
                case 4:
                  t = 'S32'
                  break
                case 5:
                  t = 'U32'
                  break
                case 6:
                default:
                  t = 'F32'
                  break
                case 7:
                  t = 'F64'
              }
              return t
            },
            isValidPixelValue: function (e, t) {
              if (null == t) return !1
              var a
              switch (e) {
                case 0:
                  a = t >= -128 && t <= 127
                  break
                case 1:
                  a = t >= 0 && t <= 255
                  break
                case 2:
                  a = t >= -32768 && t <= 32767
                  break
                case 3:
                  a = t >= 0 && t <= 65536
                  break
                case 4:
                  a = t >= -2147483648 && t <= 2147483647
                  break
                case 5:
                  a = t >= 0 && t <= 4294967296
                  break
                case 6:
                  a = t >= -34027999387901484e22 && t <= 34027999387901484e22
                  break
                case 7:
                  a = t >= 5e-324 && t <= 17976931348623157e292
                  break
                default:
                  a = !1
              }
              return a
            },
            getDataTypeSize: function (e) {
              var t = 0
              switch (e) {
                case 0:
                case 1:
                  t = 1
                  break
                case 2:
                case 3:
                  t = 2
                  break
                case 4:
                case 5:
                case 6:
                  t = 4
                  break
                case 7:
                  t = 8
                  break
                default:
                  t = e
              }
              return t
            },
            getDataTypeUsed: function (e, t) {
              var a = e
              switch (e) {
                case 2:
                case 4:
                  a = e - t
                  break
                case 3:
                case 5:
                  a = e - 2 * t
                  break
                case 6:
                  a = 0 === t ? e : 1 === t ? 2 : 1
                  break
                case 7:
                  a = 0 === t ? e : e - 2 * t + 1
                  break
                default:
                  a = e
              }
              return a
            },
            getOnePixel: function (e, t, a, i) {
              var r = 0
              switch (a) {
                case 0:
                  r = i.getInt8(t)
                  break
                case 1:
                  r = i.getUint8(t)
                  break
                case 2:
                  r = i.getInt16(t, !0)
                  break
                case 3:
                  r = i.getUint16(t, !0)
                  break
                case 4:
                  r = i.getInt32(t, !0)
                  break
                case 5:
                  r = i.getUInt32(t, !0)
                  break
                case 6:
                  r = i.getFloat32(t, !0)
                  break
                case 7:
                  r = i.getFloat64(t, !0)
                  break
                default:
                  throw 'the decoder does not understand this pixel type'
              }
              return r
            }
          }),
          (m = function (e, t, a) {
            ;(this.val = e), (this.left = t), (this.right = a)
          }),
          {
            decode: function (e, t) {
              var a = (t = t || {}).noDataValue,
                i = 0,
                r = {}
              ;(r.ptr = t.inputOffset || 0), (r.pixels = {}), h.readHeaderInfo(e, r)
              var n = r.headerInfo,
                s = n.fileVersion,
                l = h.getDataTypeArray(n.imageType)
              h.readMask(e, r), n.numValidPixel === n.width * n.height || r.pixels.resultMask || (r.pixels.resultMask = t.maskData)
              var o,
                f = n.width * n.height
              if (
                ((r.pixels.resultPixels = new l(f * n.numDims)),
                (r.counter = { onesweep: 0, uncompressed: 0, lut: 0, bitstuffer: 0, constant: 0, constantoffset: 0 }),
                0 !== n.numValidPixel)
              )
                if (n.zMax === n.zMin) h.constructConstantSurface(r)
                else if (s >= 4 && h.checkMinMaxRanges(e, r)) h.constructConstantSurface(r)
                else {
                  var u = new DataView(e, r.ptr, 2),
                    c = u.getUint8(0)
                  if ((r.ptr++, c)) h.readDataOneSweep(e, r, l)
                  else if (s > 1 && n.imageType <= 1 && Math.abs(n.maxZError - 0.5) < 1e-5) {
                    var d = u.getUint8(1)
                    if ((r.ptr++, (r.encodeMode = d), d > 2 || (s < 4 && d > 1))) throw 'Invalid Huffman flag ' + d
                    d ? h.readHuffman(e, r, l) : h.readTiles(e, r, l)
                  } else h.readTiles(e, r, l)
                }
              ;(r.eofOffset = r.ptr),
                t.inputOffset
                  ? ((o = r.headerInfo.blobSize + t.inputOffset - r.ptr), Math.abs(o) >= 1 && (r.eofOffset = t.inputOffset + r.headerInfo.blobSize))
                  : ((o = r.headerInfo.blobSize - r.ptr), Math.abs(o) >= 1 && (r.eofOffset = r.headerInfo.blobSize))
              var m = {
                width: n.width,
                height: n.height,
                pixelData: r.pixels.resultPixels,
                minValue: n.zMin,
                maxValue: n.zMax,
                validPixelCount: n.numValidPixel,
                dimCount: n.numDims,
                dimStats: { minValues: n.minValues, maxValues: n.maxValues },
                maskData: r.pixels.resultMask
              }
              if (r.pixels.resultMask && h.isValidPixelValue(n.imageType, a)) {
                var g = r.pixels.resultMask
                for (i = 0; i < f; i++) g[i] || (m.pixelData[i] = a)
                m.noDataValue = a
              }
              return (r.noDataValue = a), t.returnFileInfo && (m.fileInfo = h.formatFileInfo(r)), m
            },
            getBandCount: function (e) {
              for (var t = 0, a = 0, i = { ptr: 0, pixels: {} }; a < e.byteLength - 58; )
                h.readHeaderInfo(e, i), (a += i.headerInfo.blobSize), t++, (i.ptr = a)
              return t
            }
          }),
        k = ((g = new ArrayBuffer(4)), (p = new Uint8Array(g)), (new Uint32Array(g)[0] = 1), 1 === p[0]),
        y = {
          decode: function (e, t) {
            if (!k) throw 'Big endian system is not supported.'
            var a,
              i,
              r = (t = t || {}).inputOffset || 0,
              n = new Uint8Array(e, r, 10),
              s = String.fromCharCode.apply(null, n)
            if ('CntZImage' === s.trim()) (a = x), (i = 1)
            else {
              if ('Lerc2' !== s.substring(0, 5)) throw 'Unexpected file identifier string: ' + s
              ;(a = w), (i = 2)
            }
            for (
              var l,
                o,
                f,
                u,
                c,
                d,
                h = 0,
                m = e.byteLength - 10,
                g = [],
                p = { width: 0, height: 0, pixels: [], pixelType: t.pixelType, mask: null, statistics: [] };
              r < m;

            ) {
              var y = a.decode(e, {
                inputOffset: r,
                encodedMaskData: l,
                maskData: f,
                returnMask: 0 === h,
                returnEncodedMask: 0 === h,
                returnFileInfo: !0,
                pixelType: t.pixelType || null,
                noDataValue: t.noDataValue || null
              })
              ;(r = y.fileInfo.eofOffset),
                0 === h &&
                  ((l = y.encodedMaskData),
                  (f = y.maskData),
                  (p.width = y.width),
                  (p.height = y.height),
                  (p.dimCount = y.dimCount || 1),
                  (p.pixelType = y.pixelType || y.fileInfo.pixelType),
                  (p.mask = y.maskData)),
                i > 1 && y.fileInfo.mask && y.fileInfo.mask.numBytes > 0 && g.push(y.maskData),
                h++,
                p.pixels.push(y.pixelData),
                p.statistics.push({ minValue: y.minValue, maxValue: y.maxValue, noDataValue: y.noDataValue, dimStats: y.dimStats })
            }
            if (i > 1 && g.length > 1) {
              for (d = p.width * p.height, p.bandMasks = g, (f = new Uint8Array(d)).set(g[0]), u = 1; u < g.length; u++)
                for (o = g[u], c = 0; c < d; c++) f[c] = f[c] & o[c]
              p.maskData = f
            }
            return p
          }
        }
      e.exports ? (e.exports = y) : (this.Lerc = y)
    })()
  })
  return f(function (t, a) {
    if (t.encoding === p.LERC) {
      var i
      try {
        i = v.decode(t.heightmap)
      } catch (e) {
        throw new r.RuntimeError(e)
      }
      if (i.statistics[0].minValue === Number.MAX_VALUE) throw new r.RuntimeError('Invalid tile data')
      ;(t.heightmap = i.pixels[0]), (t.width = i.width), (t.height = i.height)
    }
    ;(t.ellipsoid = e.Ellipsoid.clone(t.ellipsoid)), (t.rectangle = e.Rectangle.clone(t.rectangle))
    var n = x.computeVertices(t),
      s = n.vertices
    return (
      a.push(s.buffer),
      {
        vertices: s.buffer,
        numberOfAttributes: n.encoding.stride,
        minimumHeight: n.minimumHeight,
        maximumHeight: n.maximumHeight,
        gridWidth: t.width,
        gridHeight: t.height,
        boundingSphere3D: n.boundingSphere3D,
        orientedBoundingBox: n.orientedBoundingBox,
        occludeePointInScaledSpace: n.occludeePointInScaledSpace,
        encoding: n.encoding,
        westIndicesSouthToNorth: n.westIndicesSouthToNorth,
        southIndicesEastToWest: n.southIndicesEastToWest,
        eastIndicesNorthToSouth: n.eastIndicesNorthToSouth,
        northIndicesWestToEast: n.northIndicesWestToEast
      }
    )
  })
})
