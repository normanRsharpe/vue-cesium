###
 # @Author: zouyaoji@https://github.com/zouyaoji
 # @Date: 2021-09-16 09:28:13
 # @LastEditTime: 2022-01-11 16:19:30
 # @LastEditors: zouyaoji
 # @Description:
 # @FilePath: \vue-cesium@next\scripts\publish.sh
###

#!/bin/sh

set -e

pnpm i --frozen-lockfile
pnpm update:version

pnpm build

cp .npmrc ./dist/vue-cesium/
cd dist/vue-cesium
# npm publish --tag next --access public --registry ${REGISTRY}

jq -r '.name="@normanRsharpe/vue-cesium"' package.json > package.json.new
mv package.json.new package.json
jq -r '.repository.url="git+https://github.com/normanRsharpe/vue-cesium.git"' package.json > package.json.new
mv package.json.new package.json
jq -r '.publishConfig["@normanRsharpe:registry"]="https://npm.pkg.github.com"' package.json > package.json.new
mv package.json.new package.json

npm publish
cd -

echo "✅ Publish completed"
