# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Lee Family Tree (李门家谱)** WeChat Mini Program - a public showcase app displaying the Lee family heritage through an interactive family tree visualization. The project is built with WeChat Cloud Development (云开发) and demonstrates the three core capabilities:

- **Database** (数据库): JSON document-based database accessible from both miniprogram frontend and cloud functions
- **File Storage** (文件存储): Cloud file storage with direct upload/download from miniprogram frontend
- **Cloud Functions** (云函数): Server-side code execution with WeChat's built-in authentication

## Design Reference

The family tree visualization design is based on `reference.html` at the project root, which contains a React implementation of the family tree component. When modifying the tree visualization, refer to this file for the intended design patterns and styling.

## Project Structure

```
family_tree_li/
├── miniprogram/           # Miniprogram frontend code
│   ├── pages/            # Page components
│   │   ├── family-tree/  # Family tree visualization (main feature)
│   │   ├── index/        # Quickstart feature index
│   │   └── example/      # Example demonstrations
│   ├── components/       # Reusable components (cloudTipModal)
│   ├── images/          # Image assets
│   ├── app.js           # Application entry point
│   ├── app.json         # App configuration (pages, window styles)
│   ├── app.wxss         # Global styles
│   └── envList.js       # Environment configuration (empty by default)
├── cloudfunctions/       # Cloud functions backend code
│   ├── familyTree/       # Family tree data operations
│   │   ├── index.js
│   │   ├── package.json
│   │   └── config.json
│   └── quickstartFunctions/
│       ├── index.js     # Cloud function entry point (exports.main)
│       ├── package.json # Dependencies (wx-server-sdk ~2.4.0)
│       └── config.json  # Permissions (openapi: wxacode.get)
├── project.config.json   # WeChat DevTools project configuration
├── reference.html        # React reference for family tree design
└── uploadCloudFunction.sh # Cloud function deployment script
```

## Key Architecture Patterns

### Cloud Function Routing
The `quickstartFunctions` cloud function uses a **type-based routing pattern**. All operations go through a single cloud function entry point, with the `event.type` parameter determining which handler to execute:

```javascript
// cloudfunctions/quickstartFunctions/index.js
exports.main = async (event, context) => {
  switch (event.type) {
    case "getOpenId": return await getOpenId();
    case "getMiniProgramCode": return await getMiniProgramCode();
    case "createCollection": return await createCollection();
    case "selectRecord": return await selectRecord();
    case "updateRecord": return await updateRecord(event);
    case "insertRecord": return await insertRecord(event);
    case "deleteRecord": return await deleteRecord(event);
  }
};
```

### Cloud Function Client Calls
Pages call cloud functions using `wx.cloud.callFunction()`:

```javascript
wx.cloud.callFunction({
  name: "quickstartFunctions",
  data: { type: "getOpenId" }
}).then((resp) => console.log(resp));
```

### Environment Configuration
The cloud environment ID must be configured in [miniprogram/app.js](miniprogram/app.js:8):

```javascript
this.globalData = {
  env: "", // TODO: Set your cloud environment ID
};
```

Get the environment ID from WeChat DevTools (click "Cloud Development" button in top-right toolbar).

## Cloud Database Operations

The project uses a `sales` collection as an example, demonstrating:
- **Create collection**: `db.createCollection("sales")`
- **Insert**: `db.collection("sales").add({ data: {...} })`
- **Select**: `db.collection("sales").get()`
- **Update**: `db.collection("sales").where({...}).update({ data: {...} })`
- **Delete**: `db.collection("sales").where({...}).remove()`

## WeChat DevTools Setup

First-time setup requires configuring the project in WeChat Developer Tools:

1. **Open Project**: Open `family_tree_li` folder in WeChat Developer Tools
2. **Configure Project Structure**:
   - AppID: Already configured in `project.config.json` (`wxa0077d98b58ce5d6`)
   - Set `miniprogram/` as the miniprogram root directory
   - Set `cloudfunctions/` as the cloud function root directory
3. **Configure Cloud Environment**:
   - Click "Cloud Development" (云开发) button in top-right toolbar
   - Create or note your cloud environment ID
   - Set the environment ID in `miniprogram/app.js` in the `globalData.env` field

## Common Development Commands

### Deploy Cloud Functions

Using WeChat Developer Tools:
1. Right-click on `cloudfunctions/quickstartFunctions/` directory
2. Select "Upload and Deploy - Install Dependencies Cloud Side" (上传并部署-云端安装依赖)

Using command line (requires WeChat CLI):
```bash
# Reference: uploadCloudFunction.sh
# Usage (variables need to be set first):
${installPath} cloud functions deploy --e ${envId} --n quickstartFunctions --r --project ${projectPath}
```

### Testing and Debugging

- **Simulator**: Use WeChat DevTools' built-in simulator for testing
- **Real Device**: Click "Preview" (预览) button to generate QR code for real device testing
- **Cloud Function Logs**: View in WeChat DevTools → Cloud Development → Cloud Functions → Logs
- **Database**: View and edit data in WeChat DevTools → Cloud Development → Database

## Key Files

- [project.config.json](project.config.json) - WeChat DevTools configuration with `appid: wxa0077d98b58ce5d6`
- [miniprogram/app.js](miniprogram/app.js) - App initialization and cloud.init()
- [miniprogram/app.json](miniprogram/app.json) - Page registration (family-tree is first page)
- [miniprogram/pages/family-tree/index.js](miniprogram/pages/family-tree/index.js) - Family tree canvas rendering and interactions
- [cloudfunctions/quickstartFunctions/index.js](cloudfunctions/quickstartFunctions/index.js) - All cloud function handlers
- [cloudfunctions/familyTree/index.js](cloudfunctions/familyTree/index.js) - Family tree data operations

## Page Navigation

The app uses a central index page ([miniprogram/pages/index/index.js](miniprogram/pages/index/index.js)) with feature cards that navigate to the example page with different types:

```javascript
wx.navigateTo({
  url: `/pages/example/index?envId=${envId}&type=${type}`
});
```

Available types: `cloudbaserun`, `getOpenId`, `getMiniProgramCode`, `createCollection`, `selectRecord`, `uploadFile`, `model-guide`, `ai-assistant`

## Component Architecture

- **cloudTipModal**: Reusable modal component for displaying tips and error messages. Used through properties: `showTipProps`, `title`, `content`

## Family Tree Feature

### Overview
The main feature is an interactive family tree visualization (`pages/family-tree/`) built with Canvas 2D API.

### Architecture
```
pages/family-tree/
├── index.wxml    # Template with canvas and modal
├── index.wxss    # Styling for tree and detail modal
├── index.js      # Tree layout algorithm and canvas rendering
└── index.json    # Page config (custom navigation)

cloudfunctions/familyTree/
├── index.js      # Cloud function for data operations
├── package.json  # Dependencies
└── config.json   # Permissions config
```

### Tree Layout Algorithm
The tree uses a **recursive width calculation** approach:
1. Each node calculates its width based on children's total width
2. Parent is centered above its children
3. Children are horizontally spaced with `horizontalGap`
4. Generations are vertically spaced with `verticalGap`

### Canvas Drawing
- Nodes are drawn as circles with gradient backgrounds (amber/amber-700 for founders, amber-500/amber-600 for others)
- Connecting lines use three segments: vertical from parent, horizontal bridge, vertical to child
- Text avatars show the last character of the name
- Name labels are drawn below each node in rounded rectangles

### Touch Handling
- **Tap**: Detect node clicks by calculating distance to node centers
- **Drag**: Pan the canvas by updating `offsetX`/`offsetY`
- **Zoom**: Use +/- buttons to adjust `scale` (0.5 to 1.5)

### Cloud Database
Collection: `family_tree`
```javascript
{
  _id: auto-generated,
  treeData: {
    id: string,
    name: string,
    relation: string,
    birth: string,
    death: string,
    bio: string,
    children: [...recursive nodes]
  },
  createTime: Date,
  updateTime: Date
}
```

### Cloud Function Operations
Call via `wx.cloud.callFunction({ name: 'familyTree', data: { type: '...' } })`:
- `type: 'get'` - Retrieve family tree data
- `type: 'save'` - Save/update tree data (requires `treeData` in event)
- `type: 'import'` - Import from JSON string (requires `jsonData` in event)
- `type: 'export'` - Export tree as JSON string

### Sample Data Structure
The sample data includes 4 generations with the Lee family:
- Generation 1: 李德厚 (founder)
- Generation 2: 李建国, 李建军
- Generation 3: 李明, 李红, 李伟, 李娜
- Generation 4: Various great-grandchildren
