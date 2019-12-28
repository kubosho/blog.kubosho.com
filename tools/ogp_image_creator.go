package main

import (
	"bytes"
	"fmt"
	"image"
	"image/color"
	"image/png"
	"io"
	"io/ioutil"
	"os"

	"golang.org/x/image/font"
	"golang.org/x/image/math/fixed"

	"github.com/golang/freetype/truetype"
	flags "github.com/jessevdk/go-flags"
)

type options struct {
	Title string `long:"title" description:"Specify title text" default:"Hello, world!"`
}

type coordinate struct {
	X fixed.Int26_6
	Y fixed.Int26_6
}

const (
	exitSuccess = 0
	exitFailure = 1

	imageWidth  = 1200
	imageHeight = 630

	fontFile = "./tools/font/GenShinGothic/GenShinGothic-Heavy.ttf"

	fontSize   = 64
	maxLength  = 30
	lineHeight = fontSize * 0.5

	textBaseX = fontSize * 0.75
	textBaseY = fontSize

	maxTextWidth = 1080
)

func createImage(width, height int) (img *image.RGBA) {
	img = image.NewRGBA(image.Rect(0, 0, width, height))

	for i := img.Rect.Min.Y; i < img.Rect.Max.Y; i++ {
		for j := img.Rect.Min.X; j < img.Rect.Max.X; j++ {
			img.Set(j, i, color.RGBA{249, 252, 255, 255})
		}
	}

	return
}

func createPngFile(img *image.RGBA) error {
	buffer := &bytes.Buffer{}

	err := png.Encode(buffer, img)
	if err != nil {
		return err
	}

	_, err = io.Copy(os.Stdout, buffer)
	if err != nil {
		return err
	}

	return nil
}

func readFontFile(fontFile string) (*truetype.Font, error) {
	binary, err := ioutil.ReadFile(fontFile)
	if err != nil {
		return nil, err
	}

	font, err := truetype.Parse(binary)
	if err != nil {
		return nil, err
	}

	return font, nil
}

func createFontFace(font *truetype.Font, fontSize float64) (face font.Face) {
	options := truetype.Options{
		Size:              fontSize,
		DPI:               0,
		Hinting:           0,
		GlyphCacheEntries: 0,
		SubPixelsX:        0,
		SubPixelsY:        0,
	}
	face = truetype.NewFace(font, &options)

	return
}

func createFontDrawer(img *image.RGBA, fontFace font.Face) (drawer *font.Drawer) {
	drawer = &font.Drawer{
		Dst:  img,
		Src:  image.Black,
		Face: fontFace,
		Dot:  fixed.Point26_6{},
	}

	return
}

func drawText(drawer *font.Drawer, textRunes [][]rune) {
	size := len(textRunes)

	for i, rune := range textRunes {
		drawer.Dot.X = fixed.I(textBaseX)
		drawer.Dot.Y = fixed.I((textBaseY+fontSize)*size + (fontSize+lineHeight)*i)
		drawer.DrawString(string(rune))
	}
}

func calcTextSeparatedPosition(drawer *font.Drawer, textRune []rune) int {
	var pos, width int

	for i, r := range textRune {
		width += drawer.MeasureString(string(r)).Round()

		if width > maxTextWidth {
			pos = i
			break
		}
	}

	return pos
}

func splitTextRune(drawer *font.Drawer, textRune []rune) (textRunes [][]rune) {
	var startPos int
	var calculatedPos int

	size := len(textRune)
	currentPos := 0

	startPos = 0
	calculatedPos = calcTextSeparatedPosition(drawer, textRune[0:size-1])
	currentPos += calculatedPos

	textRunes = append(textRunes, textRune[startPos:calculatedPos])

	for {
		startPos = calculatedPos
		calculatedPos = calcTextSeparatedPosition(drawer, textRune[startPos:size])

		currentPos += calculatedPos

		if currentPos == 0 {
			textRunes = append(textRunes, textRune[startPos:size])
			break
		}
		if currentPos > size {
			break
		}

		textRunes = append(textRunes, textRune[startPos:size])
	}

	return
}

func handleError(err error) {
	fmt.Fprintln(os.Stderr, err)
	os.Exit(exitFailure)
}

func main() {
	var opts options
	_, err := flags.Parse(&opts)
	if err != nil {
		handleError(err)
	}

	img := createImage(imageWidth, imageHeight)

	font, err := readFontFile(fontFile)
	if err != nil {
		handleError(err)
	}
	fontFace := createFontFace(font, fontSize)
	drawer := createFontDrawer(img, fontFace)

	textRunes := splitTextRune(drawer, []rune(opts.Title))
	drawText(drawer, textRunes)

	err = createPngFile(img)
	if err != nil {
		handleError(err)
	}
}
