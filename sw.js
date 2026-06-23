/* 김병진수학연구소 클래스앱 서비스 워커
 * 역할: 앱이 닫혀 있어도 백그라운드에서 푸시 메시지를 받아 알림을 띄운다.
 */

// 설치되면 바로 활성화
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });

// 푸시 메시지 수신 → 알림 표시
self.addEventListener('push', function(event){
  var data = {};
  try { data = event.data ? event.data.json() : {}; } catch(e) { data = { title:'알림', body: (event.data && event.data.text()) || '' }; }

  var title = data.title || '김병진수학연구소';
  var options = {
    body: data.body || '',
    icon: data.icon || './icon-192.png',
    badge: data.badge || './icon-192.png',
    tag: data.tag || ('msg-' + Date.now()),   // 같은 tag면 덮어씀(중복 방지)
    data: { url: data.url || './' },           // 클릭 시 열 주소
    requireInteraction: false
  };
  // iOS 요구사항: push 이벤트를 받으면 반드시 알림을 표시해야 구독이 유지됨
  event.waitUntil(self.registration.showNotification(title, options));
});

// 알림 클릭 → 앱 열기(이미 열려 있으면 포커스)
self.addEventListener('notificationclick', function(event){
  event.notification.close();
  var target = (event.notification.data && event.notification.data.url) || './';
  event.waitUntil(
    self.clients.matchAll({ type:'window', includeUncontrolled:true }).then(function(list){
      for (var i=0;i<list.length;i++){
        if ('focus' in list[i]) return list[i].focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});
