# Meeting Room Debug Guide

## 🐛 Issues Fixed

### 1. **Hangup không xóa hình ảnh**
- ✅ Added immediate video element clearing in `onEndCall`
- ✅ Force refresh video elements với `video.load()`
- ✅ Call `clearRemoteStream()` trước `hangUp()`

### 2. **Auto renegotiate chỉ hoạt động lần đầu**  
- ✅ Reset `pendingOffer = null` khi start connection mới
- ✅ Tăng delay auto-renegotiate từ 1s → 1.5s
- ✅ Added comprehensive logging

## 🧪 Test Steps

### Test Case 1: Hangup Video Cleanup
1. Doctor join meeting room
2. Patient join meeting room  
3. Verify video flow giữa 2 bên
4. **Doctor click "END CALL"**
5. ✅ Check: Doctor video elements cleared ngay lập tức
6. ✅ Check: Console log `[DOCTOR] End call cleanup completed`

### Test Case 2: Auto Renegotiate After Hangup
1. Doctor join meeting room
2. Patient join meeting room
3. Verify video flow (auto-renegotiate lần 1)
4. Doctor hangup → navigate away
5. **Doctor rejoin meeting room**
6. **Patient rejoin meeting room**  
7. ✅ Check: Auto-renegotiate hoạt động lần 2 (không cần toggle camera)
8. ✅ Check: Console logs show negotiation flow

## 📝 Console Logs để Monitor

### Expected Flow - Lần đầu join:
```
[DOCTOR] SignalR join succeeded
[PATIENT] SignalR join succeeded  
[PATIENT] Participant joined: doctor_connection_id
[DOCTOR] Participant joined: patient_connection_id
[PATIENT] CreateOffer check: {hasLocalStream: true, joinedRoomCode: "...", hasRemoteParticipant: true, isCaller: true, pendingOffer: null}
[PATIENT] Creating offer...
[DOCTOR] Received offer from: patient_connection_id
[DOCTOR] Sent answer
[PATIENT] Received answer from: doctor_connection_id
[DOCTOR] Auto-renegotiate check: {hasRemoteParticipant: true, hasLocalStream: true, pendingOffer: null}
[DOCTOR] Auto-renegotiate for track sync - EXECUTING
[DOCTOR] Auto-renegotiate completed
```

### Expected Flow - Sau hangup rejoin:
```
[DOCTOR] Connection effect: {roomCode: "...", signalRHubUrl: "..."}
[DOCTOR] SignalR join succeeded
[PATIENT] SignalR join succeeded  
[PATIENT] Participant joined: doctor_connection_id  
[DOCTOR] Participant joined: patient_connection_id
[PATIENT] CreateOffer check: {hasLocalStream: true, joinedRoomCode: "...", hasRemoteParticipant: true, isCaller: true, pendingOffer: null}
[PATIENT] Creating offer...
[DOCTOR] Auto-renegotiate check: {hasRemoteParticipant: true, hasLocalStream: true, pendingOffer: null}
[DOCTOR] Auto-renegotiate for track sync - EXECUTING ← Should trigger automatically
```

## 🚨 Red Flags
- Nếu không thấy `[DOCTOR] Auto-renegotiate for track sync - EXECUTING` → Check `pendingOffer` reset
- Nếu video không clear sau hangup → Check video.load() calls
- Nếu renegotiate fail → Check WebRTC connection state

## 🔧 Debug Commands
```bash
# Check current state
console.log('PendingOffer:', pendingOffer)
console.log('HasRemoteParticipant:', hasRemoteParticipant)  
console.log('LocalStream:', !!localStream)

# Manual renegotiate test
const offer = await renegotiate()
await sendOffer(offer)
```