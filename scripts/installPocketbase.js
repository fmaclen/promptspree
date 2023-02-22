import axios from 'axios';
import AdmZip from 'adm-zip';

const POCKETBASE_VERSION = '0.12.3';
const POCKETBASE_BASE_URL = 'https://github.com/pocketbase/pocketbase/releases/download';

const architectures = {
  'darwin': {
    'x64': 'darwin_amd64',
    'arm64': 'darwin_arm64'
  },
  'linux': {
    'x64': 'linux_amd64',
    'arm64': 'linux_arm64',
    'armv7': 'linux_armv7'
  },
  'win32': {
    'x64': 'windows_amd64',
    'arm64': 'windows_arm64'
  }
}

const downloadAndUnzipPocketbase = async () => {
  const zipFileName = `pocketbase_${POCKETBASE_VERSION}_${architectures[process.platform][process.arch]}.zip`;
  const downloadUrl = `${POCKETBASE_BASE_URL}/v${POCKETBASE_VERSION}/${zipFileName}`;

  console.info(`-> Downloading Pocketbase for ${process.platform} (${process.arch})`);
  const response = await axios.get(downloadUrl, {
    responseType: 'arraybuffer'
  });
  const zip = new AdmZip(response.data);
  zip.extractAllTo('./pocketbase', true);
  console.info(`-> Pocketbase downloaded and unzipped successfully`);
};

downloadAndUnzipPocketbase();
