from io import BytesIO
from PIL import Image
import numpy
import sys
import stitchcode
from skimage.morphology import skeletonize
from skimage.measure import label
from skimage.measure import find_contours
from skimage import img_as_bool

if __name__ == "__main__":
    input_format = 'png'
    export_format = 'svg'

    if len(sys.argv) == 3:
        input_format = sys.argv[1]
        export_format = sys.argv[2]
    elif len(sys.argv) == 2:
        export_format = sys.argv[1]

    emb = stitchcode.Embroidery()

    # Import
    if input_format == 'png':
        image_file = Image.open(sys.stdin.buffer)
        image = numpy.array(image_file)

        image=img_as_bool(image)
        image = skeletonize(image)

        labelImage=label(image)
        Contours=find_contours(labelImage,0.5,'high')
        mat=None
        for i in range(len(Contours)):
            if mat is None:
                mat=Contours[i]
            else:
                mat=numpy.vstack((mat,Contours[i]))

        for i in range(len(mat)):
            emb.addStitch(stitchcode.Point(mat[i,0],mat[i,1]))
    elif input_format == 'svg':
        emb.import_svg()

    # Export
    if export_format == 'svg':
        print(emb.export_svg())
    elif export_format == 'png':
        sys.stdout.buffer.write(emb.export_png().getvalue())
