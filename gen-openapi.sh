out_dir="../ecommerce-vue/openapi/"

mkdir -p "$out_dir"

bname="openapi"
ext="json"

filehash=$(echo "$RANDOM" | md5sum | head -c 20);

newfile="$out_dir$bname.$filehash.$ext"

yarn openapi-spec >> $newfile

echo "$newfile created successfully!"
