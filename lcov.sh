
date="$(date "+%Y-%m-%d_%H-%M-%S")"
gcnoPath="/Users/liyufeng/Library/Developer/Xcode/DerivedData/JianKangJie3-hgtxppbzwevrfhcafgbmrghynpwv/Build/Intermediates.noindex/JianKangJie3.build/Debug-iphoneos/JianKangJie3.build/Objects-normal/arm64"
workPath="/Users/liyufeng/server/测试覆盖"

for i in `ls ${gcnoPath}`; do
	if [[ $i == *.gcno ]];then
		cp -r "${gcnoPath}/${i}" ${workPath}/uploads
	fi
done

lcov -c -d ${workPath}/uploads -o ${workPath}/info/${date}.info

op=" "
for i in `ls ${workPath}/info`; do
	if [[ $i == *.info ]];then
		op=$op"-a "${workPath}"/info/${i} "
	fi
done

lcov ${op} -o ${workPath}/lcov.info
genhtml -o public ${workPath}/lcov.info
rm ${workPath}/lcov.info