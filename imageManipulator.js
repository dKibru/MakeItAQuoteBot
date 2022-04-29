import sharp from "sharp"; 
import axios from 'axios'



export async function downloadFileToBuffer(fileUrl) {
  const arrayBuffer = await axios.get(fileUrl, {
      responseType: 'arraybuffer'
  });
  return Buffer.from(arrayBuffer.data,'binary')
}


export  async function addTextOnImage(text, img, avatarUrl, username) {
    try {
      const width = 750;
      const height = 483;
  
      const quoteSvg = `
      <svg width="${width}" height="${height}">
        <style>
        .title { fill: #001; font-size: 70px; font-weight: bold;}
        </style>
        <text x="50%" y="50%" text-anchor="middle" class="title">${text}</text>
      </svg>
      `;

      const svgUsername = `
      <svg width="${width}" height="${height}">
        <style>
        .title { fill: #ffffff; font-size: 70px; font-weight: bold;}
        </style>
        <text x="50%" y="50%" text-anchor="middle" class="title">${username}</text>
      </svg>
      `
      let avatar = 'assets/kkk.png'
      if(avatarUrl){
        avatar = await downloadFileToBuffer(avatarUrl)
      }
      
      const image = await sharp(img)
                        .composite([
                            { input: avatar, top: 90, left: 1000 } , 
                            { input: Buffer.from(svgUsername), left : 400, top: 540 },
                            {
                            input: Buffer.from(quoteSvg),
                            top: 0,
                            left: 50,
                            },
                        ])
                        .sharpen()

      return image.toBuffer()

    } catch (error) {
      console.log(error);
    }
  }
  
  